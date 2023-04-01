<script>
  import {onMount } from "svelte";
  import Header from "./header.svelte";
  import Chatinput from "./ui/chatinput.svelte";
  import Chatbox from "./ui/chatbox.svelte";
  import List from "./list.svelte";
  import { makeRequest } from "../api";
  import { isCurrentPage } from "../route";
  import {DB} from "../db";

  export let location;
  let user_token = DB('get','token');
  let chatwith;
  let chat_key;
  let users ;
  export let username = "chat";
  onMount(async ()=>{
    const storedTime = DB("get", "ChatListTime");
    const currentTime = new Date().getTime();   
    

    if (!storedTime || currentTime - new Date(storedTime).getTime() > (5*60*1000)) {
      const { data } = await makeRequest('follow','GET',{user_token});
      DB("set", "ChatList", data);
      DB("set", "ChatListTime", Date());
      users = data;
    } else {
      users = DB("get","ChatList")
    }
  })
  


</script>

<main>
  <Header title={username} locked={true} />
  {#if isCurrentPage("chat")}
    <List bind:chats={users} />
  {:else}
    <Chatbox {username}/>
    <Chatinput {username}/>
  {/if}
</main>

<style>
</style>
