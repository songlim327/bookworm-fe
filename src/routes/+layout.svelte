<script>
	import '../app.pcss';
    import { ModeWatcher } from "mode-watcher";
	import { Toaster } from 'svelte-sonner';
</script>

<div id="main-layout" class="h-screen flex flex-col overflow-hidden">
	<ModeWatcher />
	<Toaster />
	<slot />
</div>


<style>
	#main-layout {
		font-family: 'Segoe UI', Roboto;
	}
	div:empty { display: none }
</style>