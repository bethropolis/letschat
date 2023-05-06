<script>
  import { login_token } from "../store";
  import { makeRequest } from "../api";
  import { onMount } from "svelte";
  import PostBox from "./ui/postBox.svelte";
  import Header from "./header.svelte";

  export let id;
  let title = "post";
  let post;
  let user_token = $login_token;

  onMount(async () => {
    //   get post
    await makeRequest("post", "GET", {
      user_token,
      post_id: id,
    }).then((response) => {
      post = response.data[0];
    });
  });
</script>

<main>
    <Header {title} />
  {#if post}
    <PostBox {post} />
  {/if}
</main>

<!-- markup (zero or more items) goes here -->

<style>

 </style>