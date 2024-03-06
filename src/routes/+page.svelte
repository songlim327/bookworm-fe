<script lang="ts">
	import Logo from '$lib/logo.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Moon, Sun, Send } from 'lucide-svelte';
	import { mode, toggleMode } from 'mode-watcher';

	let chats: string[] = ['Hi, how can I help you today?'];
	let result = '';
	// To track input state and disable send button
	let query = '';

	// Fetch from svelteKit server
	async function getResponse(message: string) {
		try {
			// const response = await fetch('/api/test', { method: 'POST' });
			const response = await fetch('/api/query', {
				method: 'POST',
				body: JSON.stringify({ message: message })
			});

			if (response.ok) {
				chats = [...chats, message];
				const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

				reader?.read().then(function stream({ done, value }): any {
					if (done) {
						console.log('done');
						// Add the final output to the chat history array
						chats = [...chats, result];
						// Clear stream result
						result = '';
						return;
					}
					const v = value.substring('data:'.length).replace('\n\n$', '');
					result += `${v} `;
					return reader.read().then(stream);
				});
			}
		} catch (error) {
			let e;
			if (error instanceof Error) e = error.message;
			else e = String(error);
			toast.error('Network error', { description: e });
		}
	}

	// Form submission handler
	const submitHandler = (e: SubmitEvent) => {
		const data = new FormData(e.target as HTMLFormElement);

		// Clear query string on submit
		query = '';

		console.log(data.get('message')!.toString());

		getResponse(data.get('message')!.toString());
	};
</script>

<!-- Navbar -->
<header class="top-0 border-b border-border/60 bg-background bg-background/95 backdrop-blur">
	<div class="container flex h-16 max-w-screen-2xl items-center">
		<div class="flex">
			<a class="mr-6 h-12 gap-x-2 md:flex md:items-center" href="/">
				<Logo class="h-8 w-8" />
				<Label class="font-bold hover:cursor-pointer">Bookworm</Label>
			</a>
			<nav class="flex items-center gap-6 text-sm">
				<a class="text-foreground/60 transition-colors hover:text-foreground/80" href="/">
					About
				</a>
				<a class="text-foreground/60 transition-colors hover:text-foreground/80" href="/">
					Feedback
				</a>
			</nav>
		</div>
		<div class="flex flex-1 items-center justify-between gap-x-2 md:justify-end">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button on:click={toggleMode} builders={[builder]} variant="ghost" size="icon">
						<Sun
							class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
						/>
						<Moon
							class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>{$mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	</div>
</header>

<!-- Content -->
<div class="container grow overflow-hidden p-6">
	<div id="chatbox" class="flex h-full flex-col justify-between overflow-hidden rounded-xl border">
		<div
			class="m-4 mx-auto h-32 w-full max-w-4xl grow overflow-y-auto p-2 scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-700 scrollbar-track-rounded-full scrollbar-thumb-rounded-full"
		>
			<!-- Chats -->
			{#each chats as chat, i}
				{#if i % 2 === 0}
					<div
						class="flex w-max max-w-[50%] flex-col gap-2 text-pretty rounded-lg bg-muted px-3 py-2 text-sm"
					>
						{chat}
					</div>
				{:else}
					<div
						class="ml-auto flex w-max max-w-[50%] flex-col gap-2 text-pretty rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
					>
						{chat}
					</div>
				{/if}
			{/each}
			{#if result !== ''}
				<div
					class="flex w-max max-w-[50%] flex-col gap-2 text-pretty rounded-lg bg-muted px-3 py-2 text-sm"
				>
					{result}
				</div>
			{/if}
		</div>
		<div class="top-auto mb-6 flex w-full flex-col">
			<form
				method="POST"
				class="align-center mb-2 mt-auto flex justify-center gap-2"
				on:submit|preventDefault={submitHandler}
			>
				<Input
					placeholder="Enter a prompt here"
					name="message"
					class="max-w-3xl"
					disabled={result !== ''}
					bind:value={query}
				/>
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="outline"
							size="icon"
							disabled={query === ''}
							type="submit"
						>
							<Send class="h-4 w-4" />
							<span class="sr-only">Ask question</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Click or press 'Enter' to send</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</form>
			<Label class="mx-auto text-sm font-normal text-muted-foreground"
				>Bookworm can make mistakes, double check it's reponse</Label
			>
		</div>
	</div>
</div>

<!-- Footer -->
<div class="container sticky bottom-0 h-12 text-sm leading-[3rem] text-muted-foreground">
	Built & designed with 💙 by <a class="font-bold underline" href="mailto:songlim327@gmail.com.my"
		>Song Lim</a
	>
</div>
