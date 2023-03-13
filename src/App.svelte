<script>
  import Intro from './lib/intro.svelte'
  import Login from './lib/login.svelte'
  import List from './lib/list.svelte'
  import Chat from './lib/chat.svelte'
	let page = 4;
</script>

<main>	
	
{#if page == 1 }
	<Intro/>
{:else if page == 2 }
	<Login/>
{:else if page ==4 }
  <List/>
		{:else}
		<Chat/>
{/if}
		
</main>


<style>
main{
	height:100vh;
	background: #a89ef5;	
 }
</style>