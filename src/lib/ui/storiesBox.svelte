<!-- CSS styling -->
<style>
    .stories {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    
    .story {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 300px;
      height: 500px;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
      background-color: #fff;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s ease-in-out;
    }
    
    .story:hover {
      transform: scale(1.05);
    }
    
    .user {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .user img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
    
    .selected {
      transform: scale(1.1);
      z-index: 1;
    }
  </style>
  
  <!-- HTML template -->
  <div class="stories">
    {#each stories as story, i}
      <div
        class="story {i === activeStoryIndex ? 'selected' : ''}"
        on:click={() => {
          markAsSeen(story.id);
          animateTransition();
        }}
      >
        <div class="user">
          <img src={story.image} alt={story.name} />
          <p>{story.name}</p>
        </div>
        <img src={story.image} alt={story.name} />
      </div>
    {/each}
  </div>
  
  <!-- JavaScript logic -->
  <script>
    // Array of user stories
    let stories = [
      {
        id: 1,
        name: "John Doe",
        image: "https://picsum.photos/id/1/200/300",
        seen: false
      },
      {
        id: 2,
        name: "Jane Doe",
        image: "https://picsum.photos/id/2/200/300",
        seen: false
      },
      {
        id: 3,
        name: "Bob Smith",
        image: "https://picsum.photos/id/3/200/300",
        seen: false
      }
    ];
    
    // Index of the currently active story
    let activeStoryIndex = 0;
    
    // Animate the transition between stories
    function animateTransition() {
      activeStoryIndex = (activeStoryIndex + 1) % stories.length;
    }
    
    // Helper function to mark a story as seen
    function markAsSeen(storyId) {
      const storyIndex = stories.findIndex(story => story.id === storyId);
      stories[storyIndex].seen = true;
    }
    
    // Animate the selected story
    $: {
      const selectedStory = document.querySelector('.selected');
      if (selectedStory) {
        // selectedStory.style.transform = 'scale(1.1)';
        // selectedStory.style.zIndex = '1';
      }
    }
  </script>
  