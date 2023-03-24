<script>
    import Footer from "./footer.svelte";
    import Header from "./header.svelte";
    export let username = "my profile";
    export let page;  // declare the page prop
    const activePage = "profile";
    function updatePage(newPage) {
      console.log(newPage.detail)
      page = newPage.detail; // update the page prop with the new value
    }
  </script>
  
  <main>
    <Header title={username} />
    <h1>Welcome to {username ? `${username}'s` : 'your'} profile!</h1>
    <Footer activePage={activePage} on:updatePage={updatePage} />
  </main>
  
  <!-- markup (zero or more items) goes here -->
  
  <style>
    /* your styles go here */
  </style>