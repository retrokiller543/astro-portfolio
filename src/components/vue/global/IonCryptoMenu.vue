<template>
    <div class="crypto-menu">
        <aside :class="['menu', { 'is-open': isMenuOpen }]">
            <button @click="toggleMenu" class="menu-toggle-button" :class="{ 'is-open': isMenuOpen }">
                <span v-if="isMenuOpen">Close</span>
                <span v-else>Open</span>
            </button>
            <ul class="menu-list home-link">
                <li><a href="/cryptography" :class="{ 'is-active': isActive('/cryptography') }">Home</a></li>
            </ul>
            <p class="menu-label">Symmetric Ciphers</p>
            <ul class="menu-list">
                <li>
                    <a href="/cryptography/caesar" :class="{ 'is-active': isActive('/cryptography/caesar') }">Caesar Cipher</a>
                    <ul>
                        <li><a href="/cryptography/caesar/playground" :class="{ 'is-active': isActive('/cryptography/caesar/playground') }">Playground</a></li>
                    </ul>
                </li>
                <li><a href="/cryptography/vigenere" :class="{ 'is-active': isActive('/cryptography/vigenere') }">Vigenere Cipher</a></li>
            </ul>
            <p class="menu-label">Asymmetric Ciphers</p>
            <ul class="menu-list">
                <li><a href="/cryptography/rsa" :class="{ 'is-active': isActive('/cryptography/rsa') }">RSA</a></li>
            </ul>
        </aside>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isMenuOpen: false, // Sidebar closed by default
        };
    },
    created() {
        // Retrieve menu state from localStorage if it exists
        const savedState = localStorage.getItem('isMenuOpen');
        if (savedState !== null) {
            this.isMenuOpen = JSON.parse(savedState);
        }
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
            // Save the current state in localStorage
            localStorage.setItem('isMenuOpen', this.isMenuOpen);
            this.$emit('menuToggled', this.isMenuOpen);
        },
        isActive(route) {
            return window.location.pathname === route;
        }
    },
};
</script>

<style scoped lang="scss">
// Variable Definitions
$menu-pos-top: 4rem;
$menu-parent-pos-top: 10%;
$button-pos-top: -1.5rem;
$button-pos-left: 15rem;
$z-index: 38;
$menu-width: 15rem;
$menu-width-mobile: 100%;
$menu-z-index: 40;
$button-width: 50px;
$button-height: 40px;
$button-bg-color: var(--primary);
$button-color: var(--white);
$button-hover-bg-color: var(--primary-color-dark);
$menu-bg-color: var(--bulma-background);
$home-link-bg-color: var(--primary-color-dark);
$menu-label-bg-color: var(--primary-color-dark);
$padding-left: 1.5em;
$padding-right: 0.5rem;
$link-margin-bottom: 0.5em;

li {
    list-style: none;
}

.crypto-menu {
    z-index: $z-index;
    display: flex;
    position: -webkit-sticky;
    position: sticky;
    top: $menu-parent-pos-top; 
    height: 100vh; 
    overflow-y: auto; 
    
    .menu {
        background-color: $menu-bg-color;
        z-index: $menu-z-index;
        width: $menu-width;
        transition: transform 0.3s ease-in-out;
        height: 100vh;
        transform: translateX(-100%);
        position: fixed;
        top: $menu-pos-top; 
        left: 0;

        .home-link {
            padding-top: 1em;
            background-color: $home-link-bg-color;
        }

        @media (max-width: 768px) {
            width: $menu-width-mobile;
            transform: translateX(-100%);
            height: 100vh; 
        }

        &.is-open {
            transform: translateX(0);
        }

        .menu-toggle-button {
            position: absolute;
            top: $button-pos-top;
            left: $button-pos-left;
            width: $button-width;
            height: $button-height; 
            background-color: $button-bg-color;
            color: $button-color;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease-in-out;

            &:focus {
                outline: none;
            }

            &:hover {
                background-color: $button-hover-bg-color;
            }

            span {
                font-weight: bold;
            }

            &.is-open {
                left: calc($button-pos-left - 4rem);

                @media screen and (max-width: 768px) {
                    right: -35rem;
                    left: 0;
                }
            }

            @media (max-width: 768px) {
                left: 41rem;
                width: auto;
                padding: 0 10px;
            }
        }

        .menu-label {
            padding: 1em;
            background-color: $menu-label-bg-color;
        }

        .menu-list {
            padding-left: $padding-left;
            padding-right: $padding-right;

            li {
                margin-bottom: $link-margin-bottom;

                a {
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