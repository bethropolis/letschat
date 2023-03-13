<script>

	let chats = [
		{name: "steven webb", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",msg: "Okay, see you there than!",time:"14:24"},	
		{name: "steven webb", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",msg: "Okay, see you there than!",time:"14:24"},		
		{name: "steven webb", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",msg: "Okay, see you there than!",time:"14:24"}
	]
</script>
<main>
	
	<div class="app">
  <h1><span>Message</span> <i class="fas fa-search"></i></h1>
  <section class="chat-list">
		{#each chats as chat }
    <div class="item">
      <img src="{chat.image}" alt="" class="avatar">
      <div>
        <h3 class="name">{chat.name}</h3>
        <span class="last-message">{chat.msg} - {chat.time}</span>
      </div>
    </div>
		{/each}
  </section>
	</div>
	
</main>
<style>
@import url("https://fonts.googleapis.com/css2?family=Nunito&display=swap");
	
main{
	 width: 100vw;
	 height: 100vh; 
	background: #a89ef5;	
 }
	
.app {
	height: 100vh;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
}


h1 {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.chat-list {
  flex: 1;
  padding: 10px;
  overflow-y: scroll;
}

.chat-list::-webkit-scrollbar {
  display: none;
}

.chat-list {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.chat-list .item {
  padding: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.chat-list .item:hover {
  background-color: #f2f3fa;
}

.chat-list .item .avatar {
  height: 60px;
  width: 60px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
}

	
</style>

