import { redirect } from 'next/navigation';

export default function BackofficeRedirectPage() {
  redirect('/guides/configurator');
}
