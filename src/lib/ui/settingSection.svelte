<script>
   export let item = null;
</script>

<div class="row">
    <i class="fas {item.icon} icon" />
    <span class="item-name">{item.name}</span>
    {#if item.type == "checkbox"}
    <label class="switch">
      <input type="checkbox" bind:checked={item.value} hidden>
      <span class="slider round"></span>
    </label>
    {:else if item.type == "action"}
    <button class="action-button" on:click={item.action}>{item.label}</button>
    {:else if item.type == "select"}
    <div class="select-wrapper">
        <select id="select" bind:value={item.value}>
          {#each item.options as option}
            <option value={option.label}>{option.label}</option>
          {/each}
        </select>
        <label for="select" class="select-value">{item.value}</label>
      </div>
      {:else if item.type == "link"}
      <!-- an icon for going externally -->
      <a href={item.link}><i class="fas fa-external-link-alt icon" /></a>
    {/if}
  </div>

<style>
.row {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.icon {
  font-size: 24px;
  margin-right: 16px;
  color: #757575;
}

.item-name {
  font-size: 16px;
  color: #212121;
  flex-grow: 1;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  margin: 0 8px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-gray);
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: var(--color-light);
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

input:checked + .slider {
  background-color: var(--color-primary);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--color-primary);
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.slider.round:before {
  border-radius: 50%;
}

.action-button {
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: var(--color-light);
  color: var(--color-primary);
  outline: 1px solid var(--color-primary);
}

.select-wrapper {
  position: relative;
  width: 120px;
  height: 32px;
  margin-left: 16px;
}

select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.select-value {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #212121;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.select-value:hover {
  background-color: #f5f5f5;
}
</style>