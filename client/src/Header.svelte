<script>
  export let Session;
</script>

<section class="cp_logo">
  <a href="https://tchat.scope.cf">trivial chat &copy;</a>
</section>
<section class="cp_header">
  <picture class="cp_header-avatar">
    <img class="cp_header-avatarimg" src={Session?.userAvatar} alt="avatar">
    <div class={Session?.online ? "online_status" : "online_status-off"}></div>
  </picture>
  <div class="cp_header-card">
    <div class="cp_header-card-1">{Session?.userTitle}</div>
    <div class="cp_header-card-2">{Session?.userDesc}</div>
  </div>
</section>