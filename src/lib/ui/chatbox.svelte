<script>
  export let messages = [
    {
      sender: "John",
      avatar: "https://i.postimg.cc/L5v3P42G/IMG-20180513-182600080.jpg",
      time: "11:30 AM",
      content: "Hey, how are you doing?",
    },
    {
      sender: "Jane",
      avatar: "https://i.postimg.cc/L5v3P42G/IMG-20180513-182600080.jpg",
      time: "11:35 AM",
      content: "I'm good, thanks for asking. How about you?",
    },
  ];
</script>

<main>
  <div class="chat-box">
    {#each messages as message}
      <div class="chat-bubble {message.sender == 'John' ? 'sender' : 'receiver'}">
        <div class="message">
          {#if message.sender !== "John"}
            <div class="avatar">
              <img src={message.avatar} alt="" class="avatar" />
            </div>
          {/if}

          <div class="content">
            {message.content}
            <div class="time">{message.time}</div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  main {
    width: 100%;
    height: 100vh;
  }
  .chat-box {
    display: grid;
    width: 100%;
  }
  .chat-bubble {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 10px;
}

.message {
  display: flex;
  align-items: center;
  margin: 10px;
}

.receiver .message {
  justify-content: flex-start;
}

.sender, .message {
  justify-content: flex-end;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}

.content {
  padding: 8px 12px;
  max-width: 70%;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.4;
  background-color: #d6e4f0;
}

.receiver .content {
  color: var(--color-light);
  background-color: var(--color-primary);
}

.time {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 0.2em 0;
  margin-right: 10px;
  font-size: 0.7em;
  color: var(--color-gray);
}
  .sender .time{
    color: var(--color-text-light);
  } 

</style>
