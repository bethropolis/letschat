<script>
    import Footer from "./footer.svelte";
    import Header from "./header.svelte";
    import UsersSearch from "./users-search.svelte";
    import { onMount } from "svelte";
    let users;
    let search = "";
    let title = "popular people to follow";
    const activePage = "search";
    let activetab = "users";
    onMount(() => {
     users.makeSearch();
    });
  </script>
  
  <main>
    <Header {title} disableBack={true} locked={true} />
  
    <div class="container">
      <div class="alert-bar">
        <!-- notify user that he or she should follow someone -->
        <!-- material ui -->
        <div class="info">
            <p>you should follow atleast 3 people</p>
        </div>
      </div>

        <UsersSearch
          bind:this={users}
          bind:type={activetab}
          bind:query={search}
        />
        {#if !users}
        <div class="alert">
          <!-- a big icon to tell user should search something -->
          <i class="fa fa-search" />
          <p>Search something</p>
        </div>
      {/if}
    </div>
  
    <Footer {activePage} />
  </main>
  
  <style>
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }
    .info {
        background: var(--color-accent-dark);
        color: #fff;
        padding: 1rem;
        border-radius: 5px;
        font-size: 1.2rem;
    }
    :global(.alert) {
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 60vh;
      padding: 0;
      font-size: 1.2rem;
      color: #9e9e9e;
      transition: all 0.3s ease;
    }
    :global(.alert i) {
      margin-bottom: 0.5rem;
      font-size: 4.2rem;
      color: #9e9e9e;
    }
    :global(.alert p) {
      margin: 0;
      padding: 0;
      font-size: 1rem;
    }
  </style>
  
