import { JWTOKEN_KEY_NAME } from "./auth";

export const remove_param_query_and_push_state_location = (query: string) => {
  const url = new URL(document.location.href)
  url.searchParams.delete(query)
  window.history.pushState('-', '-', url.href);
}

export const execute_global_url_query_actions = () => {
  const url = new URL(document.location.href)
  if (url.searchParams.get(JWTOKEN_KEY_NAME)) {
    localStorage.setItem(JWTOKEN_KEY_NAME, url.searchParams.get(JWTOKEN_KEY_NAME))
    remove_param_query_and_push_state_location(JWTOKEN_KEY_NAME)
  }
}
