<script>
import image from "../assets/chat.svg"


function handleLogin() {
    page = 2;
}

export let page;	
</script>

<main>
  <div class="cover">
		<img  class="image" src={image}>
	</div>
	<div class="text">
		<p>welcome to suplike chat app, connecting you with the people around you</p>
		<button class="btn" on:click={handleLogin}>get started</button>
	</div>
</main>
<style>

 main{
	 width: 100vw;
	 height: 100vh; 
	background: #a89ef5;	 
 }
	.cover{
		display: grid;
		align-items: center;
		justify-content: center;
		height: 90vh;
	}
	.image{
		margin: 0  auto;
		padding: 1em 2vw ;
		width: 92%; 
		height:auto; 
	}
	.text{
		width: 100%;
		text-align: center;
		position: absolute;
		bottom: 2vh;
		font-size: 1.4em;
		color: white;
		font-family: monospace; 
	}
	.btn{
		width: 60vw;
		max-width:200px;
		padding: 15px;
		border-radius: 30px;
		font-size: 1.2rem;
		border: none;
		outline: none;
		background: #6c5ce7;
		color: white;
		transition: .1s all;
	}
	.btn:active{
		background: white;
		color: #6c5ce7;
		box-shadow: 0 0 7px #6c5ce7;
		transition: 1s all;
	}
</style>