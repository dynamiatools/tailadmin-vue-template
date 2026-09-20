<template>
  <ExtLayout page-title="Ext / Layouts">
    <ComponentCard title="Hero" desc="Marketing hero section with optional image and eyebrow.">
      <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <Hero eyebrow="New" title="Build faster with TailAdmin" subtitle="Everything you need to ship an admin panel.">
          <template #actions>
            <Button size="sm">Get started</Button>
            <Button size="sm" variant="outline">Learn more</Button>
          </template>
        </Hero>
      </div>
    </ComponentCard>

    <ComponentCard title="CTA" desc="Call-to-action banner, solid or outline.">
      <div class="grid gap-4 sm:grid-cols-2">
        <CTA title="Ready to get started?" subtitle="Join thousands of teams already using TailAdmin.">
          <template #actions>
            <Button size="sm" variant="outline" class="bg-white">Sign up</Button>
          </template>
        </CTA>
        <CTA title="Talk to sales" subtitle="Get a personalized demo." variant="outline">
          <template #actions>
            <Button size="sm">Contact us</Button>
          </template>
        </CTA>
      </div>
    </ComponentCard>

    <ComponentCard title="Navbar" desc="Sticky marketing navbar with responsive mobile menu.">
      <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <Navbar brand="Acme" :links="navLinks">
          <template #actions>
            <Button size="sm">Sign in</Button>
          </template>
        </Navbar>
      </div>
    </ComponentCard>

    <ComponentCard title="Footer" desc="Multi-column marketing footer.">
      <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <Footer brand="Acme" :columns="footerColumns" />
      </div>
    </ComponentCard>

    <ComponentCard title="FeatureGrid" desc="Grid of icon + title + description feature cards.">
      <FeatureGrid title="Everything you need" :features="features" :columns="3" />
    </ComponentCard>

    <ComponentCard title="PricingTable" desc="Plan comparison cards with a highlighted tier.">
      <PricingTable title="Simple pricing" :plans="pricingPlans" @select="onPlanSelect" />
      <p class="text-sm text-gray-500 dark:text-gray-400">Selected plan: {{ selectedPlan ?? '—' }}</p>
    </ComponentCard>

    <ComponentCard title="Testimonial" desc="Customer quote cards.">
      <Testimonial title="Loved by developers" :items="testimonials" />
    </ComponentCard>

    <ComponentCard title="FAQAccordion" desc="Collapsible question/answer list.">
      <FAQAccordion title="Frequently asked questions" :items="faqItems" />
    </ComponentCard>

    <ComponentCard title="Landing" desc="Ordering shell composing the marketing sections above via named slots.">
      <div class="h-[420px] overflow-auto rounded-lg border border-gray-200 [transform:translateZ(0)] dark:border-gray-800">
        <Landing>
          <template #navbar><Navbar brand="Acme" :links="navLinks" :sticky="false" /></template>
          <template #hero><Hero title="One page, every section" subtitle="Compose Landing from the sections you need." /></template>
          <template #cta><CTA title="Ready to launch?" variant="outline" /></template>
          <template #footer><Footer brand="Acme" :columns="footerColumns.slice(0, 2)" /></template>
        </Landing>
      </div>
    </ComponentCard>

    <ComponentCard title="MobileAppLayout" desc="Header + content + bottom tab bar shell for mobile-style views.">
      <div class="relative h-[480px] w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 [transform:translateZ(0)] dark:border-gray-800">
        <MobileAppLayout :items="mobileNavItems" :active-id="mobileActiveId" @select="(item) => (mobileActiveId = item.id)">
          <template #header>
            <div class="px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-white/90">Acme App</div>
          </template>
          <div class="p-4 text-sm text-gray-500 dark:text-gray-400">Active tab: {{ mobileActiveId }}</div>
        </MobileAppLayout>
      </div>
    </ComponentCard>

    <ComponentCard title="BorderLayout" desc="Header/left/center/right/footer regions, responsive to a row layout at lg.">
      <div class="h-[360px] overflow-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <BorderLayout>
          <template #header>
            <div class="border-b border-gray-200 p-3 text-center text-sm dark:border-gray-800">Header</div>
          </template>
          <template #left>
            <div class="h-full border-r border-gray-200 p-3 text-sm dark:border-gray-800">Left</div>
          </template>
          <div class="p-3 text-sm">Center content</div>
          <template #right>
            <div class="h-full border-l border-gray-200 p-3 text-sm dark:border-gray-800">Right</div>
          </template>
          <template #footer>
            <div class="border-t border-gray-200 p-3 text-center text-sm dark:border-gray-800">Footer</div>
          </template>
        </BorderLayout>
      </div>
    </ComponentCard>

    <ComponentCard title="DocsLayout" desc="Sidebar nav + prose column + table of contents, for documentation pages.">
      <div class="h-[420px] overflow-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <DocsLayout :nav="docsNav" active-id="intro" :toc-items="docsToc" :next="{ label: 'Installation', href: '#' }">
          <h1 id="intro">Introduction</h1>
          <p>MarkdownViewer and DocsLayout share the same prose typography classes.</p>
          <h2 id="usage">Usage</h2>
          <p>Drop page content directly into the default slot.</p>
        </DocsLayout>
      </div>
    </ComponentCard>

    <ComponentCard title="AuthSplit" desc="Split-screen auth shell: brand panel + centered form column.">
      <div class="h-[360px] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <AuthSplit>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">Sign in</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back — drop a form here.</p>
        </AuthSplit>
      </div>
    </ComponentCard>

    <ComponentCard title="Tabs" desc="Tab list with keyboard navigation; top/bottom/left/right position.">
      <Tabs :tabs="tabItems" v-model="activeTab">
        <div class="p-3 text-sm text-gray-500 dark:text-gray-400">Content for "{{ activeTab }}"</div>
      </Tabs>
    </ComponentCard>

    <ComponentCard
      title="ClosableTabs"
      desc="Workspace-style tabs: × / middle-click / Delete to close, actions slot, visited panels stay mounted (max = LRU)."
    >
      <div class="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <label for="ct-max">Keep at most</label>
        <input id="ct-max" v-model.number="closableMax" type="number" min="1" class="w-16 rounded border border-gray-300 px-2 py-1 dark:border-gray-700 dark:bg-transparent" />
        <span>panels mounted</span>
      </div>
      <ClosableTabs v-model="closableActive" :tabs="closableTabs" :max="closableMax" close-label="Close" @close="closeClosable">
        <template #actions>
          <Button size="sm" variant="outline" @click="addClosable">New tab</Button>
          <Button size="sm" variant="outline" :disabled="closableTabs.length <= 1" @click="closeAllClosable">Close all</Button>
        </template>
        <template #default="{ tab }">
          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
            Panel <strong>{{ tab.label }}</strong> — type something, switch tabs and come back: it is still here.
          </p>
          <input class="w-full max-w-sm rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-transparent dark:text-white/90" :placeholder="`Draft for ${tab.label}`" />
        </template>
      </ClosableTabs>
    </ComponentCard>

    <ComponentCard title="LoginDialog" desc="Modal sign-in form with slots for social buttons and footer links.">
      <Button size="sm" @click="loginOpen = true">Open login dialog</Button>
      <LoginDialog v-model="loginOpen" @submit="onLoginSubmit">
        <template #footer>
          <span class="text-gray-500 dark:text-gray-400">Don't have an account? <a href="#" class="text-brand-500">Sign up</a></span>
        </template>
      </LoginDialog>
    </ComponentCard>

    <ComponentCard title="EmptyState" desc="Placeholder for empty/no-data states with an optional action.">
      <EmptyState
        title="No projects yet"
        description="Create your first project to get started."
        action-label="New project"
        @action="onEmptyStateAction"
      />
    </ComponentCard>

    <ComponentCard title="MarkdownViewer" desc="Renders Markdown to sanitized HTML via the optional marked + dompurify peer deps.">
      <MarkdownViewer :source="markdownSource" />
    </ComponentCard>
  </ExtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentCard from '@dynamia-tools/tailadmin-vue/components/common/ComponentCard.vue'
import Button from '@dynamia-tools/tailadmin-vue/components/ui/Button.vue'
import Hero from '@dynamia-tools/tailadmin-vue/components/ext/layouts/Hero.vue'
import CTA from '@dynamia-tools/tailadmin-vue/components/ext/layouts/CTA.vue'
import Navbar from '@dynamia-tools/tailadmin-vue/components/ext/layouts/Navbar.vue'
import type { NavLink } from '@dynamia-tools/tailadmin-vue/components/ext/layouts/Navbar.vue'
import Footer from '@dynamia-tools/tailadmin-vue/components/ext/layouts/Footer.vue'
import type { FooterColumn } from '@dynamia-tools/tailadmin-vue/components/ext/layouts/Footer.vue'
import FeatureGrid from '@dynamia-tools/tailadmin-vue/components/ext/layouts/FeatureGrid.vue'
import type { Feature } from '@dynamia-tools/tailadmin-vue/components/ext/layouts/FeatureGrid.vue'
import PricingTable from '@dynamia-tools/tailadmin-vue/components/ext/layouts/PricingTable.vue'
import type { PricingPlan } from '@dynamia-tools/tailadmin-vue/components/ext/layouts/PricingTable.vue'
import Testimonial from '@dynamia-tools/tailadmin-vue/components/ext/layouts/Testimonial.vue'
import type { TestimonialItem } from '@dynamia-tools/tailadmin-vue/components/ext/layouts/Testimonial.vue'
import FAQAccordion from '@dynamia-tools/tailadmin-vue/components/ext/layouts/FAQAccordion.vue'
import type { FAQItem } from '@dynamia-tools/tailadmin-vue/components/ext/layouts/FAQAccordion.vue'
import Landing from '@dynamia-tools/tailadmin-vue/components/ext/layouts/Landing.vue'
import MobileAppLayout from '@dynamia-tools/tailadmin-vue/components/ext/layouts/MobileAppLayout.vue'
import type { MobileNavItem } from '@dynamia-tools/tailadmin-vue/components/ext/layouts/MobileAppLayout.vue'
import BorderLayout from '@dynamia-tools/tailadmin-vue/components/ext/layouts/BorderLayout.vue'
import DocsLayout from '@dynamia-tools/tailadmin-vue/components/ext/layouts/DocsLayout.vue'
import type { DocsTocItem } from '@dynamia-tools/tailadmin-vue/components/ext/layouts/DocsLayout.vue'
import type { MenuItem } from '@dynamia-tools/tailadmin-vue/components/ext/navigation/Menu.vue'
import AuthSplit from '@dynamia-tools/tailadmin-vue/components/ext/layouts/AuthSplit.vue'
import Tabs from '@dynamia-tools/tailadmin-vue/components/ext/layouts/Tabs.vue'
import ClosableTabs from '@dynamia-tools/tailadmin-vue/components/ext/layouts/ClosableTabs.vue'
import type { ClosableTabItem } from '@dynamia-tools/tailadmin-vue/components/ext/layouts/ClosableTabs.vue'
import type { TabItem } from '@dynamia-tools/tailadmin-vue/components/ext/layouts/Tabs.vue'
import LoginDialog from '@dynamia-tools/tailadmin-vue/components/ext/layouts/LoginDialog.vue'
import EmptyState from '@dynamia-tools/tailadmin-vue/components/ext/layouts/EmptyState.vue'
import MarkdownViewer from '@dynamia-tools/tailadmin-vue/components/ext/layouts/MarkdownViewer.vue'
import { HomeIcon, ListIcon, UserCircleIcon, SettingsIcon } from '@dynamia-tools/tailadmin-vue/icons'
import ExtLayout from './ExtLayout.vue'

const navLinks: NavLink[] = [
  { label: 'Product', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Docs', href: '#' },
]

const footerColumns: FooterColumn[] = [
  { title: 'Product', links: [{ label: 'Features', href: '#' }, { label: 'Pricing', href: '#' }] },
  { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }] },
  { title: 'Resources', links: [{ label: 'Docs', href: '#' }, { label: 'Support', href: '#' }] },
]

const features: Feature[] = [
  { title: 'Fast setup', description: 'Get running in minutes with sensible defaults.' },
  { title: 'Dark mode', description: 'Every component ships with a dark variant.' },
  { title: 'Accessible', description: 'Keyboard navigation and ARIA attributes built in.' },
]

const pricingPlans: PricingPlan[] = [
  { name: 'Starter', price: '$0', period: '/mo', features: ['1 project', 'Community support'], cta: 'Get started' },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    features: ['Unlimited projects', 'Priority support', 'Team roles'],
    highlighted: true,
    badge: 'Popular',
    cta: 'Start trial',
  },
  { name: 'Enterprise', price: 'Custom', features: ['SSO', 'Dedicated support'], cta: 'Contact us' },
]
const selectedPlan = ref<string | null>(null)
function onPlanSelect(plan: PricingPlan) {
  selectedPlan.value = plan.name
}

const testimonials: TestimonialItem[] = [
  { quote: 'TailAdmin cut our build time in half.', name: 'Jordan Lee', role: 'CTO, Acme' },
  { quote: 'The ext components are exactly what we needed.', name: 'Priya Shah', role: 'Frontend Lead' },
]

const faqItems: FAQItem[] = [
  { question: 'Is this free to use?', answer: 'Yes, the package is MIT licensed.' },
  { question: 'Does it support dark mode?', answer: 'Every component has a dark variant out of the box.' },
]

const mobileNavItems: MobileNavItem[] = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'list', label: 'Browse', icon: ListIcon },
  { id: 'profile', label: 'Profile', icon: UserCircleIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]
const mobileActiveId = ref<string | number>('home')

const docsNav: MenuItem[] = [
  { id: 'intro', label: 'Introduction' },
  { id: 'usage', label: 'Usage' },
]
const docsToc: DocsTocItem[] = [
  { id: 'intro', label: 'Introduction', depth: 1 },
  { id: 'usage', label: 'Usage', depth: 1 },
]

const tabItems: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity' },
  { id: 'settings', label: 'Settings' },
]
const activeTab = ref<string | number>('overview')

const closableTabs = ref<ClosableTabItem[]>([
  { id: 'home', label: 'Control Panel', closable: false },
  { id: 'clients', label: 'Clients' },
  { id: 'invoices', label: 'Invoices' },
])
const closableActive = ref<string | number>('home')
const closableMax = ref(3)
let closableSeq = 0
function addClosable() {
  const id = `new-${++closableSeq}`
  closableTabs.value = [...closableTabs.value, { id, label: `New ${closableSeq}` }]
  closableActive.value = id
}
// The parent owns the list and decides what becomes active after a close.
function closeClosable(id: string | number) {
  const index = closableTabs.value.findIndex((t) => t.id === id)
  closableTabs.value = closableTabs.value.filter((t) => t.id !== id)
  if (closableActive.value === id) closableActive.value = closableTabs.value[Math.max(0, index - 1)].id
}
function closeAllClosable() {
  closableTabs.value = closableTabs.value.filter((t) => t.closable === false)
  closableActive.value = closableTabs.value[0].id
}

const loginOpen = ref(false)
function onLoginSubmit(credentials: { email: string; password: string }) {
  loginOpen.value = false
  console.log('login submit', credentials)
}

function onEmptyStateAction() {
  console.log('empty state action clicked')
}

const markdownSource = `# Markdown preview

Renders **bold**, _italic_, and \`inline code\`.

- List item one
- List item two

> Requires the optional \`marked\` and \`dompurify\` peer dependencies.
`
</script>
