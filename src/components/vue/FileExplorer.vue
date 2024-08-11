<template>
    <div class="file-explorer">
      <!-- Breadcrumb for navigation -->
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path" :class="{ 'is-active': index === breadcrumbs.length - 1 }">
            <a @click="navigateTo(crumb.path)">{{ crumb.name }}</a>
          </li>
        </ul>
      </nav>
  
      <!-- Main content area with directory listing and file preview side by side -->
      <div class="content-area">
        <!-- Panel for directory listing -->
        <div class="panel" :class="{ 'open-file': selectedFileContent }">
          <p class="panel-heading">
            Repository: {{ repo }}
          </p>
          <a class="panel-block" v-if="path !== ''" @click="navigateTo(parentPath)">
            <span class="panel-icon">
              <i class="fas fa-arrow-left" aria-hidden="true"></i>
            </span>
            ..
          </a>
          <a
            v-for="file in files"
            :key="file.path"
            class="panel-block"
            @click="handleClick(file)"
          >
            <span class="panel-icon">
              <i :class="file.type === 'dir' ? 'fas fa-folder' : 'fas fa-file-alt'" aria-hidden="true"></i>
            </span>
            {{ file.name }}
          </a>
        </div>
  
        <!-- File preview, only render if a file is selected -->
        <transition name="fade">
          <div v-if="selectedFileContent" class="box file-preview">
            <h2 class="subtitle">{{ selectedFileName }}</h2>
            <pre>{{ selectedFileContent }}</pre>
          </div>
        </transition>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  
  export default {
    props: {
      owner: {
        type: String,
        required: true
      },
      repo: {
        type: String,
        required: true
      },
      path: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      const files = ref([]);
      const loading = ref(true);
      const selectedFileContent = ref('');
      const selectedFileName = ref('');
      const breadcrumbs = ref([{ name: props.repo, path: '' }]);
  
      const fetchFiles = async (path) => {
        loading.value = true;
        selectedFileContent.value = '';
        selectedFileName.value = '';
        try {
          const response = await fetch(`https://api.github.com/repos/${props.owner}/${props.repo}/contents/${path}`);
          files.value = await response.json();
          updateBreadcrumbs(path);
        } catch (error) {
          console.error('Error fetching files:', error);
        } finally {
          loading.value = false;
        }
      };
  
      const updateBreadcrumbs = (path) => {
        const parts = path.split('/').filter(Boolean);
        breadcrumbs.value = [{ name: props.repo, path: '' }];
        let currentPath = '';
        parts.forEach(part => {
          currentPath += `${part}/`;
          breadcrumbs.value.push({ name: part, path: currentPath.slice(0, -1) });
        });
      };
  
      const handleClick = (file) => {
        if (file.type === 'dir') {
          fetchFiles(file.path);
        } else {
          fetchFileContent(file.path);
        }
      };
  
      const fetchFileContent = async (filePath) => {
        try {
          const response = await fetch(`https://api.github.com/repos/${props.owner}/${props.repo}/contents/${filePath}`);
          const file = await response.json();
          selectedFileContent.value = atob(file.content);
          selectedFileName.value = file.name;
        } catch (error) {
          console.error('Error fetching file content:', error);
        }
      };
  
      const navigateTo = (path) => {
        fetchFiles(path);
      };
  
      onMounted(() => {
        fetchFiles(props.path);
      });
  
      watch(() => props.path, fetchFiles);
  
      return {
        files,
        loading,
        selectedFileContent,
        selectedFileName,
        breadcrumbs,
        navigateTo,
        handleClick
      };
    }
  };
  </script>
  
  <style scoped>
  .file-explorer {
    display: flex;
    flex-direction: column;
  }
  
  .breadcrumb {
    margin-bottom: 1rem;
  }
  
  /* Flexbox layout for side-by-side display */
  .content-area {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .panel {
    flex: 1; /* Take full width by default */
    transition: width 0.3s ease; /* Add transition to width */
  }
  
  .open-file {
    width: 100%; /* Make full width on mobile when a file is open */
  }
  
  .file-preview {
    width: 100%;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
  
  /* Fade transition for file preview */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  
  .panel-block {
    cursor: pointer;
  }
  
  .panel-block:hover {
    background-color: #f5f5f5;
  }
  
  /* Mobile styles */
  @media screen and (max-width: 768px) {
    .content-area {
      flex-direction: column; /* Stack the content vertically on mobile */
    }
    
    .panel {
      width: 100%; /* Full width for both panel and preview on mobile */
    }
  
    .open-file {
      width: 100%;
    }
  
    .file-preview {
      width: 100%;
    }
  }
  </style>