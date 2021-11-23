<div class={"clients_item " + ($selectedUserIdx === i ? "client-selected" : "")} onClick={handlerClick}>
  <div class="clients_item-img">
    <div class={"clients_item-img-pulse " + (newMsgTrigger && $selectedUserIdx !== i ? 'pulse' : '')}></div>
    <img class="clients_item-img-img" src={`${$URL}/img/users/user${n.pict}.png`} alt=''/>
  </div>
  <div class="clients_item-status">
    <div class="clients_item-status-title">Banjo {i}</div>
    <div class="clients_item-status-desc">{user_msgs[arr_last].msg1}</div>
  </div>
  <div class="btn_close-min"></div>
</div>