<script>
  
  import Header from "./header.svelte";
  import Chatinput from "./ui/chatinput.svelte";
  import Chatbox from "./ui/chatbox.svelte";
  import List from "./list.svelte";
  import { isCurrentPage } from "../route";
  export let username ="chat";
</script>
<main>
  <Header title={username} locked={true}/>
 {#if isCurrentPage('chat')}
   <List/>
   {:else}
  <Chatbox />
  <Chatinput />
  {/if}
</main>
<style>
</style>