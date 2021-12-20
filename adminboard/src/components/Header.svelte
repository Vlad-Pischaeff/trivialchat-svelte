<script>
  import { tooltip } from '../js/__Tooltip';
  import { isAuthorized, selectedUserIdx } from "../store/store";

  const handlerClick = () => logout();

  const logout = () =>  {
    $isAuthorized = false;
    $selectedUserIdx = null;
  }

</script>

<section class="header">
  <nav>
    {#if $isAuthorized}
      <a href="/">
        <img  class="p_icon" alt="logout" use:tooltip title="Logout..." on:click={handlerClick}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAzCAYAAAAn3w6xAAAACXBIWXMAAC4jAAAuIwF4pT92AAAERklEQVR4nO1bXWsdRRie95w5GzCaj9N8nF54o0KCXjSJN4ohUCKlJM3NQYpQEBQUai0Fb/wkx6gXyQ9ICrmoaKFXES9sGhEKGotoaUlBMLZSL+xFE/LRRG2h5+zu6zO7yWb3pE1h9+zOSTgPzOzsTLL7vM+Znfed2VnJzCIKaG2tUTQ0nBREr+D0GRzrI10wDjBbyJeQZoVlTbCUP242ySjXJdN8QTQ2fgOjc1E5xgqiNHLF8aiQ8igxT4q5uXe4p6cUWgAqFjtEJvMdLt5YOaYJgegt0d2tesXb4XtAJjMeMJ75PvJLSHciE6w8VA84AL5PeTVEx9GDz4USAL9+pzCMfq+C+ZYolfrZMP6MTDUm0MhISgwPfw7DP/Aq0+mQPUDKvsA583vVbLwCFwo2RPgYIuQhQsdGdV/YRyA46JnmVfSISASTgCMC8xyKmwLkwgngjqq+KztuZrdgiyvsiOQG9wJqAugmoBs1AXQT0I2aALoJ6EZNgJ0aaXW1QTQ3F1DMimLxM66r+8tpUIEPkf9Pd1MgFMBDBdgwXk13X3QqDKMTuVu2bVX/EZIBMa6J0dG/RaGQCOFK44EC0MrKEyKbveAZ76J1s8BSXsaMsAuzqefE+vr3KsaOnWlM2CYALS09LlpalPEveZWqy9v2+zB4q8ow5nGYh1CJEI0LAQFocbFetLVNw/her1IZz/wap9NTibNLAJ4AdPv2YyKX+xbGb831XeNf51TqnBZ2CcARYMP48zD+oNfCbCO9AePPamOXAKTzzOdyP8H4rrK2aaQi2farOogBLEzzGsaa63HeRGLA+x3GP7mthWjISTqRyZhkmi/71/ErDflA46sFRBKeZxClGAVQK7rVKgKzKSxrWsj4InYplpefxWMwCxG6fTdW78smcfwhtjs/GsmMAdza+h+8QG/ACxACfeY3UfoZXuCrOAnsiARWmp2+xfv334MIR8pESCE/Ay/Ae9kVeg+XI8Li4hAiwQteMOQuf38BEay9GgwFRhdub7+LuGAQY8KMFw67InxJlnUf4fDXOkjGiW3DqzMmrKwMYJIz402IlDtKpcZQ2vsCKPC+ff/S6upAYD3A3WDggKam0iKf/9DxHLY9jp5xMRG2MeChDpaz2X8gwmGI8AlOm9WKkKircxvz+WPoEZ865VTqEMaOdvX4JMC34tgxwlAi4PCuc7JpvALR075yvWhqUi9Lb8ZBMG7UFkV1E9CNmgC6CehGTQDdBHSjJoBuAroRToDyd4Plm6aqG763O2yF7QELgTMpn0d+IzynZLCxWbLbV7UQTgDTnA2s1hCNUbF4pZo3S/p2inb4qmdDCQBD/yDmi7iYu11WLapmMr+hrnr3Cg8PB/cKK1jWRPhBsFQ6AaN/9TZME6nZUv/O/1RFYD7NUl4KLYBarSXTPCzS6er/XqAc7vcCp0RPTzQ3CAV/obW1zl35xQiMV/gfUiRaqUWZJHYAAAAASUVORK5CYII=" />
      </a>
    {/if}
  </nav>
</section>

<style>
  .header {
    background: #333;
    height: var(--height-header);
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
	}
  nav {
    display: flex;
    align-items: center;
  }
  nav a {
		padding: 0 .2rem;
	}
</style>