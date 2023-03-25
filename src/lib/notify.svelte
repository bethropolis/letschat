<script>
  import { makeRequest } from "../api.js";
  import { onMount } from "svelte";

  let notifications = [];

  let title = "Notifications";
  let unseen = true;
  let notificationList = [];

  function filterNotifications() {
    if (unseen) {
      notificationList = notifications.filter((n) => n.seen === "0");
    } else {
      notificationList = notifications;
    }
  }

  function markAsSeen(notificationId) {
    const notification = notifications.find(
      (n) => n.notification_id === notificationId
    );
    if (notification) {
      notification.seen = "1";
    }
    filterNotifications();
  }

  function deleteNotification(notificationId) {
    const index = notifications.findIndex(
      (n) => n.notification_id === notificationId
    );
    if (index !== -1) {
      notifications.splice(index, 1);
      filterNotifications();
    }
  }

  onMount(() => {
    getNotifications("all");
  });
  export async function getNotifications(type,id="") {
    const { data } = await makeRequest("notify", "GET", {
      user_token: "16c78b8e0c126b30749f8d93ad9de7479f7decb572",
      type,
      id
    });
    notifications = data;
    filterNotifications();
  }
</script>

<main>
  <div class="notifications">
    <div class="tabs">
      <div
        class="tab"
        class:selected={unseen}
        on:click={() => {
          unseen = true;
          filterNotifications();
        }}
      >
        Unseen
      </div>
      <div
        class="tab"
        class:selected={!unseen}
        on:click={() => {
          unseen = false;
          filterNotifications();
        }}
      >
        All
      </div>
    </div>

    <div class="notification-list">
      {#each notificationList as notification}
        <div class="notification" class:seen={notification.seen === "1"}>
          <div class="notification-text">{@html notification.text}</div>
          <div class="notification-date">{notification.date}</div>
          <div class="notification-actions">
            <button
              class="notification-action"
              title="Mark as seen"
              on:click={() => markAsSeen(notification.notification_id)}
            >
            {#if notification.seen === "0"}
              <i class="fas fa-check" />
            {/if}
            </button>
            <button
              class="notification-action"
              title="Delete notification"
              on:click={() => deleteNotification(notification.notification_id)}
            >
              <i class="fas fa-trash" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>

<!-- markup (zero or more items) goes here -->
<style>
    main {
        margin-bottom: 4em;
    }
    .notifications {
     display: flex;
     flex-direction: column;
     align-items: center;
     margin: 1rem 0;
   }
   
   .tabs {
     display: flex;
     justify-content: space-evenly;
     align-items: center;
     width: 100%;
     font-family: Arial, Helvetica, sans-serif;
     margin: 1rem auto;
     width: 100%;
   }
   
   .tab {
     margin-right: 1rem;
     padding-bottom: 0.5rem;
     font-weight: 600;
     border-bottom: 2px solid #555;
     color: #555;
     cursor: pointer;
     transition: all 0.2s ease-in-out;
   }
   
   .tab.selected {
     border-bottom: 2px solid #8a2be2;
     color: #8a2be2;
   }
   
   .notification-list {
     width: 100%;
     box-shadow: 0 4px 4px -4px rgba(0, 0, 0, 0.2), 0 -4px 4px -4px rgba(0, 0, 0, 0.2);
   }
   
   .notification-list .notification {
     display: flex;
     flex-direction: column;
     padding: 1rem;
     border-top: 1px solid #eee;
   }
   
   .notification-list .notification.seen {
     background-color: #f9f9f9;
   }
   
   .notification-list .notification:first-child {
     border-top: none;
   }
   
   .notification-list .notification .notification-text {
     margin-bottom: 0.5rem;
     font-weight: 600;
   }
   
   .notification-list .notification .notification-date {
     color: #999;
     font-size: 0.9rem;
   }
   
   .notification-list .notification .notification-actions {
     display: flex;
     align-items: center;
     margin-top: 0.5rem;
   }
   
   .notification-list .notification .notification-action {
     display: flex;
     align-items: center;
     justify-content: center;
     width: 2rem;
     height: 2rem;
     margin-right: 0.5rem;
     color: #999;
     background-color: #f9f9f9;
     border: none;
     border-radius: 50%;
     cursor: pointer;
     transition: all 0.2s ease-in-out;
   }
   
   .notification-list .notification .notification-action:hover {
     color: #8a2be2;
     background-color: #eee;
   }
   
   .notification-list .notification .notification-action i {
     font-size: 1rem;
     margin-right: 0.5rem;

   }
   
   
   </style>
   
