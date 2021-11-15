<aside>
  <div class="aside_img"></div>
</aside>

<style>
aside {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
  background: darkslateblue;
  transition: flex 1s linear;
}
.aside_img {
  position: absolute;
  top: 0;
  left: 0;
  background-image: url('./img/img36.jpg');
  background-size: cover;
  background-position: 0% 50%;
  /* animation: flowleft 5s linear */
  opacity: 0.85;
  transition: opacity 4s linear, background-position 8s linear;
}
aside, .aside_img {
  height: 100%;
  width: 100%;
}
@keyframes flowleft {
  from {
    background-position: 0% 50%;
    opacity: 0;
  }
  to {
    background-position: 100% 50%;
    opacity: 0.85;
  }
}
</style>