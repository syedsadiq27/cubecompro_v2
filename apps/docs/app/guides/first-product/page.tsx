import { redirect } from 'next/navigation';

export default function FirstProductRedirect() {
  redirect('/guides/configurator');
}
