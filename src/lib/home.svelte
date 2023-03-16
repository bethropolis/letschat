<script>
  import Footer from "./footer.svelte";
  export let page;  // declare the page prop
  const activePage = "home"
  function updatePage(newPage) {
    console.log(newPage.detail)
    page = newPage.detail; // update the page prop with the new value
  }
</script>

<main>
  <Footer activePage={activePage} on:updatePage={updatePage} />
</main>

<!-- markup (zero or more items) goes here -->

<style>
  /* your styles go here */
</style>
