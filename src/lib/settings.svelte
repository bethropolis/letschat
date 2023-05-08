<script>
  import { nav } from "../route";
  import { DB } from "../db";
  import Header from "./header.svelte";
  import Snack from "./ui/snackbar.svelte";
  import SettingSection from "./ui/settingSection.svelte";

  const title = "settings";
  let msg = "";
  let user = {
    name: DB("get", "login", "username"),
    fname: DB("get", "login", "full_name"),
    avatar: DB("get", "login", "profile_picture"),
  };

  const settingsPage = {
    sections: [
      {
        title: "appearance",
        items: [
          {
            name: "Dark theme",
            icon: "fas fa-palette",
            value: false,
            type: "checkbox",
          },
          {
            name: "font size",
            icon: "fas fa-font",
            value: "medium",
          },
        ],
      },
      {
        title: "notifications",
        items: [
          {
            name: "push notifications",
            icon: "fas fa-mobile",
            value: false,
            type: "checkbox",
          },
          {
            name: "snackbar notifications",
            icon: "fas fa-bell",
            value: true,
            type: "checkbox",
          },
        ],
      },
      {
        title: "language",
        items: [
          {
            name: "language",
            icon: "fas fa-globe",
            value: "en",
            type: "select",
            options: [{ value: "en", label: "English" }],
          },
        ],
      },
      {
        title: "Account",
        items:[
          {
            name: "account settings",
            icon: "fa fa-user-alt",
            link: "settings",
            type: "link"
          },
          {
            name: "github",
            icon: "fab fa-github",
            link: "https://github.com/bethropolis/suplike-social-website",
            type: "link"
          }
        ]
      },
      {
        title: "Actions",
        items: [
          {
            name: "Logout of account",
            icon: "fas fa-sign-out-alt",
            value: false,
            type: "action",
            label: "logout",
            action: function () {},
          },
          {
            name: "Logout of all accounts",
            icon: "fas fa-sign-out-alt",
            value: false,
            type: "action",
            label: "logout",
            action: function () {
              DB("clear");
              nav("login");
            },
          },
        ],
      }
    ],
  };

  function logOut() {
    DB("remove", "token");
    DB("remove", "login");
    msg = "you have successfully logged out";
    nav("login");
  }
</script>

<!-- Settings.svelte -->
<!-- Settings.svelte -->
<main class="settings">
  <Header {title} />
  <header class="settings-header">
    <div class="settings-header-avatar">
      <input type="file" id="avatar" hidden />
      <label for="avatar"><img src={user.avatar} alt="User Avatar" /></label>
      <div class="change-img">
        <i class="fas fa-camera" />
      </div>
    </div>
    <h1 class="settings-header-title">{user.name}</h1>
    <p class="settings-header-subtitle">{user.fname || ""}</p>
  </header>
  {#each settingsPage.sections as section}
    <h3>{section.title}</h3>
    {#if section.items}
      {#each section.items as item}
        <SettingSection bind:item />
      {/each}
    {:else if section.list}
      {#each section.list as item}
        <ul>
          <li>
            <a href={item.link}>{item.name}</a>
          </li>
        </ul>
      {/each}
    {/if}
  {/each}

  <Snack bind:msg />
</main>

<style>
  /* Main Settings Container */
  .settings {
    max-width: 500px;
    margin: 0 auto;
    padding: 0 10px;
  }

  /* Settings Header */
  .settings-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
  }

  .settings-header-avatar {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
    overflow: hidden;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }

  .settings-header-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .settings-header-avatar .change-img {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50%;
    bottom: 0;
    background-color: var(--color-gray);
  }

  .settings-header-title {
    font-size: 28px;
    margin-bottom: 5px;
    text-align: center;
  }

  .settings-header-subtitle {
    font-size: 16px;
    color: #999;
    text-align: center;
  }

  ul{
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li{
    margin: 10px;
  }
  li a{
    text-decoration: none;
    color: var(--color-text);
    font-size: 18px;
    font-weight: 500;
    transition: 0.3s;
  }
</style>
