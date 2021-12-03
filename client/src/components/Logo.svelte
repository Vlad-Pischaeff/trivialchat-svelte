<script>
  import { goto } from '$app/navigation';
	import { isAuthorized } from "../store/store";
  
  const routeToPage = (route, replaceState = true) => goto(`/${route}`, { replaceState });

	const handleAnimEnd = () =>	routeToPage('about');
</script>

<div class="logo {$isAuthorized ? 'logo_notauth' : 'logo_auth'}" on:transitionend={handleAnimEnd}>
	trivial chat
</div>