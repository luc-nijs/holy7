// YouTube films, newest first. They show in the home carousel ("Uitgelicht")
// and on the Media page. Placeholder selection (2026-11-07): to be replaced.
export const videos = [
  { id: 'k8I6ghV8zlU', title: 'Indian Summer', sub: 'live, 2025' },
  { id: 'Cz3OzKR9x0E', title: 'Opa Tsupa', sub: 'live in Bretagne, 2023' },
  { id: 'fcgLhpp2d4Y', title: 'The Holy 7', sub: 'live' },
];

export const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const embed = (id) => `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1`;
export const watch = (id) => `https://www.youtube.com/watch?v=${id}`;
