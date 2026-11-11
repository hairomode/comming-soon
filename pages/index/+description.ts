import type { PageContext } from 'vike/types';
import type { Data } from './+data';
export default function description(pageContext: PageContext) {
  return (pageContext.data as Data).meta.description;
}
