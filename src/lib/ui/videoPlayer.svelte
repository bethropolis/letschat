<script context="module">
  import { current } from "../../store";
</script>

<script>
  import { onMount } from "svelte";

  export let videoProps;

  let videoPlayer = {};
  let mainElement;
  let isPlaying = false;
  let timeLength = "";
  let timeFrame = 1;
  let backward = false;
  let forward = false;
  let onScreen;
  let sidebarOpen = false;
  let fullscreen = false;

  // Function to play video
  function play() {
    onScreen = TextTrackCue;
    videoPlayer.play();
    isPlaying = true;
    displayOnScreenBtn();
  }

  // Function to pause video
  function pause() {
    onScreen = TextTrackCue;
    videoPlayer.pause();
    isPlaying = false;
    displayOnScreenBtn();
  }

  // Function to hide on-screen buttons after 600ms
  function displayOnScreenBtn() {
    setTimeout(() => {
      backward = false;
      forward = false;
      onScreen = false;
    }, 600);
  }

  // Function to toggle sidebar visibility
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  // Function to toggle play/pause of video
  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  // Function to toggle mute of video
  function toggleMute() {
    videoPlayer.muted = !videoPlayer.muted;
  }

  // Function to set volume of video
  function setVolume(e) {
    videoPlayer.volume = e.target.value / 100;
  }

  // Function to seek the video
  function seek(e) {
    videoPlayer.currentTime = (e.target.value / 100) * videoPlayer.duration;
  }

  // Function to update time length of video
  function updateTimeLength() {
    timeFrame = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    const remainingTime = Math.ceil(
      videoPlayer.duration - videoPlayer.currentTime
    );
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timeLength = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  // On mount function to add event listeners
  onMount(() => {
    videoPlayer.addEventListener("timeupdate", updateTimeLength);
    document.addEventListener("fullscreenchange", () => {
      fullscreen = document.fullscreenElement !== null;
    });
  });

  // Function to handle clicks on video element
  function handleClick(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log(rect.top);
    const width = rect.width;
    const height = rect.height;
    const time = videoPlayer.duration * (x / width);

    // If sidebar is closed
    if (!sidebarOpen) {
      if (x < width / 8) {
        // Click on backward icon
        backward = true;
        videoPlayer.currentTime -= 10;
      } else if (x > (width * 7) / 8) {
        // Click on forward icon
        forward = true;
        videoPlayer.currentTime += 10;
      } else if (
        x > (width * 8) / 20 &&
        x < (width * 13) / 20 &&
        y > (height * 5) / 20 &&
        y < (height * 15) / 20
      ) {
        // Click on play/pause icon
        onScreen = true;
        togglePlay();
      }
      displayOnScreenBtn();
    } else {
      // If sidebar is open
      toggleSidebar();
    }
  }

  // Function to toggle fullscreen mode
  function toggleFullscreen() {
    if (!fullscreen) {
      mainElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    fullscreen = !fullscreen;
  }
</script>

<main bind:this={mainElement}>
  <div class="container">
    <div class="videoContainer">
      {#if videoProps}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video
          bind:this={videoPlayer}
          src={videoProps.src}
          on:click={handleClick}
          on:pause={pause}
          on:play={(e) => {
            const video = e.currentTarget;

            if (video !== $current) {
              $current?.pause();
              $current = video;
            }
          }}
        >
          video is not supported
        </video>
      {/if}
      <div class="onScreenPlay" on:click={handleClick}>
        <div class="backward">
          {#if backward}
            <i class="fa fa-backward" />
          {/if}
        </div>
        <div class="play-btn">
          {#if onScreen}
            {#if isPlaying}
              <i class="fas fa-pause" />
            {:else}
              <i class="fas fa-play" />
            {/if}
          {/if}
        </div>
        <div class="forward">
          {#if forward}
            <i class="fa fa-forward" />
          {/if}
        </div>
      </div>
    </div>
    {#if videoProps.controls || fullscreen}
      <div class="controls">
        <button class="btn" on:click={togglePlay}>
          {#if isPlaying}
            <i class="fas fa-pause" />
          {:else}
            <i class="fas fa-play" />
          {/if}
        </button>
        <input
          class="slider"
          type="range"
          min="0"
          max="100"
          step="0.01"
          value={timeFrame}
          on:input={seek}
          style="flex: 1;"
        />
        <div class="time-remaining">{timeLength}</div>
        <div class="volume">
          <button class="btn" on:click={toggleMute}>
            {#if videoPlayer?.muted}
              <i class="fas fa-volume-mute" />
            {:else if videoPlayer?.volume > 0.5}
              <i class="fas fa-volume-up" />
            {:else}
              <i class="fas fa-volume-down" />
            {/if}
          </button>
          <button class="settings-btn btn" on:click={toggleSidebar}>
            <i class="fas fa-cog" />
          </button>
          <button class="fullscreen-btn btn" on:click={toggleFullscreen}>
            {#if fullscreen}
              <i class="fas fa-compress" />
            {:else}
              <i class="fas fa-expand" />
            {/if}
          </button>
        </div>
        <div class="sidebar" class:active={sidebarOpen}>
          <div class="sidebar-content">
            <ul>
              <li>
                disable controls
                <input type="checkbox" bind:checked={videoProps.controls} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  main:fullscreen {
    background: #000;
  }
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  }
  main:fullscreen .container {
    height: 100%;
  }
  main:fullscreen .controls {
    position: absolute;
    bottom: 10px;
    margin: 0 auto;
  }
  :root {
    --primary-color: #9fa0ff;
    --secondary-color: #bbd0ff;
  }

  video::-webkit-media-controls-fullscreen-button,
  video::-webkit-media-controls-mute-button,
  video::-webkit-media-controls-play-button,
  video::-webkit-media-controls-timeline,
  video::-webkit-media-controls-timeline-container,
  video::-webkit-media-controls-timeline-track {
    background-color: var(--primary-color);
  }

  video::-webkit-media-controls-volume-slider-container,
  video::-webkit-media-controls-volume-slider {
    color: var(--primary-color);
  }

  video::-webkit-media-controls-current-time-display,
  video::-webkit-media-controls-time-remaining-display {
    color: var(--secondary-color);
  }
  .videoContainer {
    position: relative;
    height: 100%;
  }

  .onScreenPlay {
    display: flex;
    position: absolute;
    justify-content: space-around;
    color: var(--secondary-color);
    width: 100%;
    top: calc(50% - 1.4rem);
    font-size: 2rem;
    grid-template-columns: repeat(3, auto);
    transition: all 0.3s ease-out;
  }

  .onScreenPlay i {
    opacity: 0.5;
  }

  .controls {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border-radius: inherit;
  }

  .slider {
    flex-grow: 1;
  }

  .volume {
    display: flex;
    align-items: center;
  }
  video {
    padding: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    /* transform: translate(-32px, -25px); */
  }

  .btn {
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 18px;
    color: var(--primary-color);
  }

  .btn:hover {
    color: var(--secondary-color);
  }

  .slider {
    -webkit-appearance: none;
    width: 10%;
    height: 2px;
    border-radius: 2px;
    background-color: var(--primary-color);
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  .volume {
    display: flex;
    align-items: center;
  }
  .time-remaining {
    font-size: 0.75rem;
    color: var(--primary-color);
    font-family: sans-serif;
  }
  .sidebar {
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: fit-content;
    border-top-left-radius: 1em;
    background-color: rgba(0, 0, 0, 0.9);
    transition: all 0.3s ease-in-out;
  }

  .sidebar.active {
    right: 0;
    width: fit-content;
    display: block;
  }

  .sidebar-content {
    padding: 1rem;
  }

  .sidebar-content ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .sidebar-content li {
    margin: 0.5rem 0;
  }
  .sidebar-content li {
    color: var(--secondary-color);
    text-decoration: none;
  }

  .sidebar-content li:hover {
    color: var(--primary-color);
    text-decoration: none;
  }
</style>
