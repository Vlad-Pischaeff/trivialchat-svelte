<script>
  import { selectedUserIdx, clients } from '../store/store';
  import { url } from '../store/wstore';
  import ButtonClose from './ButtonClose.svelte';

  export let index;
  export let item;

  let user_msgs, arr_last;

  const deleteUser = () => clients.delete(index);

  const handlerClick = () => {
    $selectedUserIdx = index;
    clients.resetCounter(index);
  }

  $: {
      user_msgs = item.msgarr.filter(n => n.msg1);
      arr_last = user_msgs.length - 1;
    }

</script>

<div class={"clients_item " + ($selectedUserIdx === index ? "client-selected" : "")} on:click={handlerClick}>
  <div class="clients_item-img">
    <div class={"clients_item-img-pulse " + (item.cnt !== 0 && $selectedUserIdx !== index ? 'pulse' : '')}></div>
    <img class="clients_item-img-img" src={`${url}/img/users/user${item.pict}.png`} alt=''/>
  </div>
  <div class="clients_item-status">
    <div class="clients_item-status-title">Banjo {index}</div>
    <div class="clients_item-status-desc">{user_msgs[arr_last].msg1}</div>
  </div>
  <div class="clients_item-tools">
    <div class="btn_close-client">
      <ButtonClose size="1rem" handlerClose={deleteUser}/>
    </div>
    <div class="counter">
      {item.cnt ? item.cnt : ''}
    </div>
  </div>
</div>

<style>
  .counter {
    text-align: center;
    font-size: .9rem;
    color:deepskyblue;
  }
</style>