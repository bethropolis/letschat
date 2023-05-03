import Snackbar from "./lib/ui/snackbar.svelte";

// displaying snackbar

export function snack(msg) {
  // @ts-ignore
  const snackbar = new Snackbar({
    target: document.body,
    props: {
      msg,
    },
  });

  snackbar.showSnackbar();
}
