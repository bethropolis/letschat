<script>
  import Header from "./header.svelte";
  import Footer from "./footer.svelte";
  import Notify from "./notify.svelte";
  import Snackbar from "./ui/snackbar.svelte";

  let title = "Notifications";
  let activePage = "notifications";
  let msg;
</script>

<main>
  <Header {title} />
  <Notify />
  <Snackbar bind:msg />
  <Footer {activePage} />
</main>

<style>

</style>