<script>
import axios from 'axios';
import { onMount } from 'svelte';
let userData = {
	name: 'Jonna',
	pass: 'Jonna7'
};
const headers = {
        'Content-Type': 'text/plain'
    };
$: data = {
		userEmail: userData.name,
		userPass: userData.pass,
	}
	
function login() {
	console.log(userData);
	axios.post('https://bethro.alwaysdata.net/api/v1/?login', data,{headers})
	.then(response => {
		console.log(response.data);
		alert(response.data);
	})
	.catch(function (error) {
		console.error(error);
	});
		
	}
</script>

<main>
<div class="form">
		<h1>sign up</h1>
	<input type="text"  bind:value={userData.name} placeholder="username..." id="f_mail">
	<input type="text" bind:value={userData.pass} placeholder="password..." id="f_pass">
	<button type="submit" class="btn"  on:click={login}> login</button>
	<br>
	<p>Haven't <b>signup</b> or <b>forgot password?</b></p>
</div>
</main>

<style>
main{
	 width: 100vw;
	 height: 100%; 
	background: #a89ef5;	
	text-align: center;
 }
	.h1{
		background: none;
		padding:0;
		margin: 0;
	}
	.form{
		padding: 10vh 0;
		height: auto;
		width: 100vw;
		text-align: center;
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
	input{
		width: 85%;
		padding: 1em;
		margin: .5rem 0;
		background:#eee;
		border-radius: 2px;
		outline: none;
		border: none;
	}
	.form p{
		width: 90%;
		padding: 1em;
		text-align: left;	
	}
</style>
