<script>
  import { makeRequest } from "../api.js";
  import  { nav }  from "../route.js";
    let user_token = "16c78b8e0c126b30749f8d93ad9de7479f7decb572";
    let users = [];
    export let query;
    export let type;
  
    export async function makeSearch(){
      const { data } = await makeRequest("search", "GET", { user_token,query,type });
      console.log(data);
      users = data.data;
    };

  let selectedUser = null;
  let active;

  function selectUser(user) {
    selectedUser = user;
  }
  function loadProfile(user) {
    nav(`/profile/${user.uidusers}`);
  }
</script>

<div class="user-list">
  {#each users as user}
    <div
      class="user "
      class:active={selectedUser === user}
      on:click={() => selectUser(user)}
    >
      <img src="https://suplike.xyz/img/{user.profile_picture}" alt={user.uidusers} on:click={()=>loadProfile(user)}/>
      <div class="info">
        <div class="name" on:click={()=>loadProfile(user)}>{user.uidusers}</div>
        <div class="username">{user.bio||"i am using suplike"}</div>
      </div>
    <div class="actions">
      <button class:active={active} on:click={(elem) => {
        const i = elem.currentTarget.querySelector('i');
        active = !active;
        i.classList.toggle('fa-plus');
        i.classList.toggle('fa-check');
      }}>
        <i class="fa fa-plus"></i>
      </button>
    </div>
    </div>
  {/each}
</div>

<style>
  .user-list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;
    width: 100%;
  }

  .user {
    display: flex;
    align-items: center;
    padding: 0.7em 10px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
  }

  .user:last-child {
    border-bottom: none;
  }

  .user:hover {
    background-color: #f5f5f5;
  }

  .user img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
  }

  .user .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .user .name {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 5px;
  }

  .user .username {
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 5px;
  }

  .user .last-msg {
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user .time {
    font-size: 0.8rem;
    color: #888;
    margin-left: auto;
  }
.user .actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
}
.user .actions button {
  background-color: transparent;
  border: none;
  color: #9B9B9B;
  cursor: pointer;
  font-size: 1.1rem;
  border-radius: 50%;
  transition: all 0.5s ease;
}
.user .actions button:hover {
  color: var(--color-primary);
}

  .active {
    background-color: #f5f5f5;
  }

  @media (max-width: 768px) {
    .user img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }

    .user .name {
      font-size: 1rem;
    }

    .user .username {
      font-size: 0.8rem;
    }

    .user .last-msg {
      display: none;
    }

    .user .time {
      font-size: 0.7rem;
    }
  }
</style>
