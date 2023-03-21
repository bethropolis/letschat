
<!-- Settings.svelte -->
<script>
  let user = {
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "https://via.placeholder.com/150",
  };

  let settingsPage = {
    pageTitle: "Settings",
    sections: [
      {
        title: "General",
        items: [
          {
            type: "text",
            label: "Username",
            value: "johndoe",
          },
          {
            type: "email",
            label: "Email",
            value: "johndoe@example.com",
          },
          {
            type: "password",
            label: "Password",
            value: "",
          },
          {
            type: "checkbox",
            label: "Send me promotional emails",
            value: true,
          },
        ],
      },
      {
        title: "Privacy",
        items: [
          {
            type: "select",
            label: "Who can see your profile?",
            value: "everyone",
            options: [
              { label: "Everyone", value: "everyone" },
              { label: "Only Friends", value: "friends" },
              { label: "Only Me", value: "me" },
            ],
          },
          {
            type: "checkbox",
            label: "Show my online status",
            value: false,
          },
        ],
      },
    ],
  };
</script>

<!-- Settings.svelte -->
<template>
  <main class="settings">
    <header class="settings-header">
      <div class="settings-header-avatar">
        <img src={user.avatar} alt="User Avatar" />
      </div>
      <h1 class="settings-header-title">{user.name}</h1>
      <p class="settings-header-subtitle">{user.email}</p>
    </header>

    <ul class="settings-list">
      {#each settingsPage.sections as section}
        <li class="settings-list-section">
          <h2 class="settings-list-section-title">{section.title}</h2>

          <ul class="settings-list-items">
            {#each section.items as item}
              <li class="settings-list-item">
                {#if item.type === 'checkbox'}
                  <label class="settings-list-item-label">
                    <input class="settings-list-item-checkbox" type="checkbox" checked={item.value} />
                    <span>{item.label}</span>
                  </label>
                {:else if item.type === 'select'}
                  <label class="settings-list-item-label">
                    <span>{item.label}</span>
                    <select class="settings-list-item-select" value={item.value}>
                      {#each item.options as option}
                        <option value={option.value}>{option.label}</option>
                      {/each}
                    </select>
                  </label>
                {:else}
                  <label class="settings-list-item-label">
                    <span>{item.label}</span>
                    <input class="settings-list-item-input" type={item.type} value={item.value} />
                  </label>
                {/if}
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </main>
</template>

<style>
  /* Main Settings Container */
  .settings {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
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
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 10px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }

  .settings-header-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

  /* Settings List */
  .settings-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Settings List Section */
  .settings-list-section {
    margin-bottom: 20px;
  }

  .settings-list-section-title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  /* Settings List Items */
  .settings-list-items {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Settings List Item */
  .settings-list-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    transition: all 0.3s ease;
  }

  .settings-list-item:hover {
    background-color: #f9f9f9;
  }

  /* Settings List Item Label */
  .settings-list-item-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  /* Settings List Item Input */
  .settings-list-item-input {
    width: 100%;
    padding: 5px;
    border: none;
    border-radius: 5px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .settings-list-item-input:focus {
    outline: none;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  }

  /* Settings List Item Checkbox */
  .settings-list-item-checkbox {
    margin-right: 10px;
  }

  /* Settings List Item Select */
  .settings-list-item-select {
    padding: 5px;
    border: none;
    border-radius: 5px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .settings-list-item-select:focus {
    outline: none;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  }
</style>

