<script>
  import { enabledGreenLight, clientsNumber } from '../store/wstore';
</script>

<footer>
  <div class={$enabledGreenLight ? "indicator_desc-on" : "indicator_desc-off"}>
    ws
  </div>
  <div class={$enabledGreenLight ? "indicator-on" : "indicator-off"}>
  </div>
  <img class="clients_img" alt="clients" src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAAB20lEQVRIidXWT4hOURjH8c87kUFJGSVTFlJK3mQxNeXPAgsLa7GwtaCsZ7KxUTbKQlZKyWqSkWxY0CAisZDydwyLYSENaSJjxuKcO92uc+97xszGU0/P7T6/83zP/3v5D6wbJ/AaP/Eep7FiISGLMIKZhD/BsoUCHayBFD44l2K7cQVvhekZws6YW4IbDaDHuZBBTCcKTGMgatbiaw3oSw6kvwZShu2I2rM1mk/Vol0J0GG0GjrSwtH4fK1G8y4HtLUBUlhfjKM1+Zs5oO4M0NIYvydyv3AhBzSeAfoQY28idwZjOaD7GaCRGDdX3o/ieEZ70NZ517WjdriSu5MLKexyA+hS1KzDj0T+Fg4Ih7qj9eJjosgYeqLmfENnZoQtvl/zUQHHEo2PxNxezdNb9otYnNoMhU0l3n2L8TlOYaJTb3EI5+qSbbxJ9O6usDaFrRKuod8Jbdn/6tAeYTGbGk3hOraX2u2Lo61rM3uu1gifhJw5L/sQVscafZhMaMaxCzYI35y5Qgp/hfURNoCHuIqTwqaZvdIezANS+O3qGlStJSxk0+7LsUksbxJ0CUOfr73MEW3BM/8+bU+xqROkVYr92IaN0XuE+2pl1EwI/2+f8SKO4h4eRWCj/QGeUvphJi2MTAAAAABJRU5ErkJggg==" />
  <div class="clients_desc">
    {$clientsNumber}
  </div>
  <p>Trivial Chat 2021 &copy;</p>
</footer>

<style>
  .indicator-on,
  .indicator-off {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
  }
  .indicator-on {
    background: rgb(205, 255, 154);
    animation: signal 1s infinite ease-in-out;
  }
  .indicator-off {
    background: #444;
    border: 1px solid #888;
  }
  .indicator_desc-on,
  .indicator_desc-off  {
    width: 3rem;
  }
  .indicator_desc-on {
    color: #ddd;
  }
  .indicator_desc-off {
    color: gray;
  }
  .clients_desc {
    color: #ddd;
    margin-left: 1rem;
  }
  .clients_img {
    width: 1rem;
    margin-left: 1rem;
    filter: invert(70%);
  }
  @keyframes signal {
  0% {
    background: rgb(115, 128, 123);
  }
  50% {
    background: aquamarine;
    box-shadow: 0 0 4px aquamarine;
  }
  100% {
    background: rgb(115, 128, 123);
  }
}
</style>