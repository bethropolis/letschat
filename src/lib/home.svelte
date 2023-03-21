<script>
  import Footer from "./footer.svelte";
  import Posts from "./home-post.svelte";
  export let page;  // declare the page prop
  const activePage = "home"
  function updatePage(newPage) {
    console.log(newPage.detail)
    page = newPage.detail; // update the page prop with the new value
  }
</script>

<main>
  <Posts />
  <Footer activePage={activePage} on:updatePage={updatePage} />
</main>

<style>
  /* your styles go here */
</style>
