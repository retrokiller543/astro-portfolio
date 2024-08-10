<template>
    <div class="crypto-menu">
        <aside :class="['menu', { 'is-open': isMenuOpen }]">
            <button @click="toggleMenu" class="menu-toggle-button">
                <!-- You can use any icon or text here -->
                <span v-if="isMenuOpen">Close</span>
                <span v-else>Open</span>
            </button>
            <p class="menu-label">Symmetric Ciphers</p>
            <ul class="menu-list">
                <li><a href="/caesar">Caesar Cipher</a></li>
                <li><a href="/vigenere">Vigenere Cipher</a></li>
            </ul>
            <p class="menu-label">Asymmetric Ciphers</p>
            <ul class="menu-list">
                <li><a href="/rsa">RSA</a></li>
            </ul>
        </aside>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isMenuOpen: true,
        };
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
            console.log('Menu toggled:', this.isMenuOpen);  // Debugging: log the state
            this.$emit('menuToggled', this.isMenuOpen);
        },
    },
};
</script>

<style scoped lang="scss">

li {
    list-style: none;
}

.crypto-menu {
    display: flex;
    position: -webkit-sticky;
    position: sticky;
    top: 5rem; /* Adjust this value to match the height of your navbar */
    height: calc(100vh - 5rem); /* Adjust to ensure it spans the full height minus the navbar */
    overflow-y: auto; /* Allows scrolling within the sidebar if content overflows */
    
    .menu {
        background-color: var(--bulma-background);
        z-index: 200; /* Ensure the sidebar is above other content */
        width: 15rem;
        transition: transform 0.3s ease-in-out;
        height: 100vh;
        transform: translateX(-100%);
        position: fixed; /* Fixed positioning to stick to the side */
        top: 5rem; /* Adjust according to the navbar height */
        left: 0;

        @media (max-width: 768px) {
            width: 100%;
            transform: translateX(-100%);
        }

        &.is-open {
            transform: translateX(0);
        }

        .menu-toggle-button {
            position: absolute;
            top: 0;
            right: -50px;
            width: 50px;
            height: 100%;
            background-color: var(--primary);
            color: var(--white);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            writing-mode: vertical-rl;
            text-orientation: mixed;

            &:focus {
                outline: none;
            }

            &:hover {
                background-color: var(--primary-color-dark);
            }

            span {
                font-weight: bold;
            }
        }

        .menu-label {
            padding: 1em;
            background-color: var(--primary-color-dark);
        }

        .menu-list {
            padding-left: 1.5em;
            padding-right: 0.5rem;

            li {
                margin-bottom: 0.5em;

                a {
                    color: var(--white);
                    text-decoration: none;

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
    }
}
</style>