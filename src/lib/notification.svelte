<script>
  import Header from "./header.svelte";
  import Footer from "./footer.svelte";
  import Notify from "./notify.svelte";
  let title = "Notifications";
  let activePage = "notifications";

</script>

<main>
  <Header {title} />
  <Notify />
  <Footer {activePage} />
</main>

<style>

</style>