<script>
  import Footer from "./footer.svelte";
  import Posts from "./home-post.svelte";
  import Header from "./header.svelte";
  // chat,make post pages
  let navOptions = [{
    title: "make post",
    icon: "fas fa-plus",
    link: "post"
  }, {
    title: "chat",
    icon: "fas fa-comment",
    link: "chat"
  }
  ]
  const activePage = "home"
</script>


<main>
  <Header {navOptions} locked={false} />
  <Posts />
  <Footer activePage={activePage} />
</main>

<style>
main{
  width: 100%;
  height: auto;
}
</style>
