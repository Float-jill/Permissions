import './App.css'
import { ACCESS_ROLE_LABELS, type AccessRoleId } from './accessRoles'
import { DataHubPeoplePage } from './DataHubPeoplePage'
import { useEffect, useRef, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  Database,
  DollarSign,
  Folder,
  GraduationCap,
  LayoutDashboard,
  PanelLeft,
  PanelLeftClose,
  Pencil,
  Share2,
  Star,
  Users,
  Waypoints,
} from 'lucide-react'

function formatDepartmentSummary(values: string[]): string {
  const v = values.length ? values : ['All people']
  if (v.includes('All people')) return 'All people'
  if (v.length === 1) return v[0]
  if (v.length === 2) return `${v[0]}, ${v[1]}`
  return `${v.length} departments`
}

function ScopeDropdown({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (opt: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="scope-dd">
      <button
        type="button"
        className="scope-dd__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="scope-dd__value">{value}</span>
        <ChevronDown size={12} strokeWidth={2} className={`scope-dd__chevron${open ? ' scope-dd__chevron--open' : ''}`} />
      </button>
      {open && (
        <ul className="scope-dd__menu" role="listbox">
          {options.map((opt) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              className={`scope-dd__item${opt === value ? ' scope-dd__item--active' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); onChange(opt); setOpen(false) }}
            >
              {opt === value && <Check size={12} strokeWidth={2.5} className="scope-dd__tick" />}
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ScopeMultiDropdown({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function toggleOpt(opt: string) {
    if (opt === 'All people') {
      onChange(['All people'])
      return
    }
    const withoutAll = value.filter((x) => x !== 'All people')
    const has = withoutAll.includes(opt)
    let next = has ? withoutAll.filter((x) => x !== opt) : [...withoutAll, opt]
    if (next.length === 0) next = ['All people']
    onChange(next)
  }

  return (
    <div ref={ref} className="scope-dd">
      <button
        type="button"
        className="scope-dd__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Department scope"
      >
        <span className="scope-dd__value">{formatDepartmentSummary(value)}</span>
        <ChevronDown size={12} strokeWidth={2} className={`scope-dd__chevron${open ? ' scope-dd__chevron--open' : ''}`} />
      </button>
      {open && (
        <ul
          className="scope-dd__menu scope-dd__menu--multi"
          role="listbox"
          aria-multiselectable="true"
        >
          {options.map((opt) => {
            const isSelected =
              opt === 'All people'
                ? value.includes('All people')
                : value.includes(opt) && !value.includes('All people')
            return (
              <li
                key={opt}
                role="option"
                aria-selected={isSelected}
                className={`scope-dd__item scope-dd__item--multi${isSelected ? ' scope-dd__item--multi-checked' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  toggleOpt(opt)
                }}
              >
                <input
                  type="checkbox"
                  className="scope-dd__checkbox"
                  tabIndex={-1}
                  readOnly
                  checked={isSelected}
                  aria-hidden
                />
                <span>{opt}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export type PricingPlanId = 'pro' | 'starter'

const PLAN_OPTIONS: { id: PricingPlanId; label: string; hint: string }[] = [
  { id: 'pro', label: 'Pro', hint: 'Full org & offices' },
  { id: 'starter', label: 'Starter', hint: 'Core settings' },
]

function PlanDropdown({
  value,
  onChange,
}: {
  value: PricingPlanId
  onChange: (plan: PricingPlanId) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const current = PLAN_OPTIONS.find((p) => p.id === value)!

  return (
    <div ref={ref} className="plan-dd">
      <button
        type="button"
        className={`plan-dd__trigger plan-dd__trigger--${value}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Pricing plan: ${current.label}. Change plan preview`}
      >
        <span className="plan-dd__trigger-text">{current.label}</span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`plan-dd__chevron${open ? ' plan-dd__chevron--open' : ''}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul className="plan-dd__menu" role="listbox">
          {PLAN_OPTIONS.map((opt) => (
            <li key={opt.id}>
              <button
                type="button"
                role="option"
                aria-selected={opt.id === value}
                className={`plan-dd__option plan-dd__option--${opt.id}${opt.id === value ? ' plan-dd__option--active' : ''}`}
                onClick={() => {
                  onChange(opt.id)
                  setOpen(false)
                }}
              >
                <span className="plan-dd__option-label">{opt.label}</span>
                <span className="plan-dd__option-hint">{opt.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const ORG_NAV = [
  { id: 'billing', label: 'Plans & billing' },
  { id: 'general', label: 'General' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'security', label: 'Security' },
  { id: 'access', label: 'Access rights' },
  { id: 'timeoff-org', label: 'Time off' },
  { id: 'statuses', label: 'Statuses' },
] as const

/** Org sidebar items available on Starter (rest are Pro-only in this preview). */
const STARTER_ORG_NAV_IDS = new Set<string>([
  'billing',
  'general',
  'notifications',
  'access',
  'timeoff-org',
  'statuses',
])

function orgNavForPlan(plan: PricingPlanId) {
  if (plan === 'pro') return [...ORG_NAV]
  return ORG_NAV.filter((item) => STARTER_ORG_NAV_IDS.has(item.id))
}

type OfficeSectionId = (typeof OFFICE_SUBITEMS)[number]['id']

type OfficeNavActive =
  | { mode: 'overview'; officeId: string }
  | { mode: 'section'; officeId: string; childId: OfficeSectionId }

const OFFICE_SUBITEMS = [
  { id: 'policies', label: 'Policies' },
  { id: 'access', label: 'Access' },
  { id: 'work-schedule', label: 'Work schedule' },
  { id: 'currencies', label: 'Currencies' },
  { id: 'time-tracking', label: 'Time tracking' },
  { id: 'time-off', label: 'Time off' },
] as const

const OFFICES = [
  { id: 'beaverton', label: 'Beaverton HQ' },
  { id: 'hilversum', label: 'Hilversum' },
  { id: 'shanghai', label: 'Shanghai' },
  { id: 'new-york', label: 'New York' },
  { id: 'london', label: 'London' },
  { id: 'sydney', label: 'Sydney' },
] as const

// ── Access Rights ───────────────────────────────────────────────────────────

interface ConfigPerm {
  id: string
  label: string
  enabled: boolean
  featured?: boolean       // shown in the top Defaults section
  group?: string           // category for progressive disclosure
  scope?: string
  scopeOptions?: string[]
  /** Single-select scope (projects, clients, etc.) */
  activeOption?: string
  /** Multi-select departments when `multiScope` is true */
  activeOptions?: string[]
  /** PEOPLE_OPTIONS: allow multiple departments; uses `activeOptions` */
  multiScope?: boolean
}

interface Role {
  id: AccessRoleId
  label: string
  count: number
  description: string
  configPerms: ConfigPerm[]
  footerNote?: string
}

const PEOPLE_OPTIONS = [
  'All people',
  'Design',
  'Engineering',
  'People ops',
  'CS',
  'Marketing',
  'Leadership',
]

const ROLES: Role[] = [
  {
    id: 'admin',
    label: ACCESS_ROLE_LABELS.admin,
    count: 4,
    description: 'Can manage all People, Projects, and Team settings',
    configPerms: [
      { id: 'billing',      label: 'Billing: Can add seats, upgrade plan', enabled: true,  featured: true, scope: 'Everyone' },
      { id: 'security',     label: 'Security',     enabled: true,  featured: true },
      { id: 'integrations', label: 'Integrations', enabled: true,  featured: true },
      { id: 'api-keys',     label: 'API Key(s)',   enabled: true,  featured: true },
    ],
  },
  {
    id: 'project-manager',
    label: ACCESS_ROLE_LABELS['project-manager'],
    count: 24,
    description: 'Manage projects they own or are given access to',
    footerNote: 'Cannot access settings pages',
    configPerms: [
      // featured defaults
      { id: 'view-projects',        label: 'View projects',               enabled: true,  featured: true, group: 'Projects',   scope: 'Projects they own/can edit',         scopeOptions: ['All projects'],             activeOption: 'All projects' },
      { id: 'edit-project-settings',label: 'Edit project settings',       enabled: true,  featured: true, group: 'Projects',   scope: 'Projects they own/can edit',         scopeOptions: ['All projects'],             activeOption: 'All projects' },
      { id: 'view-schedule',        label: 'View Schedule',               enabled: true,  featured: true, group: 'Scheduling', scope: 'People on projects they own/can edit',scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
      { id: 'schedule-people',      label: 'Schedule people',             enabled: true,  featured: true, group: 'Scheduling', scope: 'People on projects they own/can edit',scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
      { id: 'view-projects-report', label: 'View Projects Report',        enabled: true,  featured: true, group: 'Reports',    scope: 'Projects they own/can view',         scopeOptions: ['All projects'],             activeOption: 'All projects' },
      { id: 'view-budget',          label: 'View budget',                 enabled: true,  featured: true, group: 'Finance',    scope: 'Projects they own/can edit',         scopeOptions: ['All projects'],             activeOption: 'All projects' },
      // Projects group
      { id: 'create-projects',      label: 'Create projects',             enabled: false, group: 'Projects',   scope: 'Projects they own/can edit',         scopeOptions: ['All projects'],             activeOption: 'All projects' },
      { id: 'delete-projects',      label: 'Delete projects',             enabled: false, group: 'Projects',   scope: 'Projects they own/can edit',         scopeOptions: ['All projects'],             activeOption: 'All projects' },
      { id: 'create-estimates',     label: 'Create and manage estimates', enabled: true,  group: 'Projects',   scope: 'Projects they own/can edit',         scopeOptions: ['All projects'],             activeOption: 'All projects' },
      { id: 'view-bill-rates',      label: 'View bill rates',             enabled: true,  group: 'Finance',    scope: 'Projects they own/can edit',         scopeOptions: ['All projects'],             activeOption: 'All projects' },
      { id: 'view-project-margin',  label: 'View project margin',         enabled: true,  group: 'Finance',    scope: 'Projects they own/can edit',         scopeOptions: ['All projects'],             activeOption: 'All projects' },
      { id: 'view-client-rates',    label: 'View client rate cards',      enabled: true,  group: 'Finance',    scope: 'Clients on projects they own/can edit',scopeOptions: ['All clients','Specific clients'], activeOption: 'All clients' },
      // Scheduling group
      { id: 'schedule-roles',       label: 'Schedule roles',              enabled: true,  group: 'Scheduling', scope: 'All roles',                          scopeOptions: ['Selected roles'],           activeOption: 'Selected roles' },
      { id: 'approve-time-off',     label: 'Approve time off for people', enabled: false, group: 'Scheduling', scope: 'People on projects they own/can edit',scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
      // Reports group
      { id: 'view-people-report',   label: 'View People Report',          enabled: false, group: 'Reports',    scope: 'People on projects they own/can edit',scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
      { id: 'view-logged-time',     label: 'View logged time',            enabled: true,  group: 'Reports',    scope: 'People on projects they own/can edit',scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
      // Finance group
      { id: 'view-cost-rates',      label: 'View cost rates',             enabled: false, group: 'Finance',    scope: 'People on projects they own/can edit',scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
      { id: 'view-finance-dashboard',label: 'View project finance dashboard',enabled: false, group: 'Finance', scope: 'Projects they own/can edit',        scopeOptions: ['All projects'],             activeOption: 'All projects' },
      { id: 'view-ops-dashboard',   label: 'View people ops dashboard',   enabled: false, group: 'Finance',    scope: 'People on projects they own/can edit',scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
    ],
  },
  {
    id: 'resource-planner',
    label: ACCESS_ROLE_LABELS['resource-planner'],
    count: 12,
    description: 'Schedule people within scope, can approve time off for people in scope',
    footerNote: 'Cannot access settings pages',
    configPerms: [
      { id: 'view-schedule',    label: 'View Schedule',               enabled: true,  featured: true, group: 'Scheduling', scope: 'People in scope', scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
      { id: 'schedule-people',  label: 'Schedule people',             enabled: true,  featured: true, group: 'Scheduling', scope: 'People in scope', scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
      { id: 'approve-time-off', label: 'Approve time off for people', enabled: true,  featured: true, group: 'Scheduling', scope: 'People in scope', scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
      { id: 'schedule-roles',   label: 'Schedule roles',              enabled: true,  group: 'Scheduling', scope: 'All roles',    scopeOptions: ['Selected roles'],           activeOption: 'Selected roles' },
      { id: 'view-logged-time', label: 'View logged time',            enabled: false, group: 'Reports',    scope: 'People in scope', scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
      { id: 'view-cost-rates',  label: 'View cost rates',             enabled: false, group: 'Finance',    scope: 'People in scope', scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
      { id: 'view-people-report',label: 'View People Report',         enabled: false, group: 'Reports',    scope: 'People in scope', scopeOptions: PEOPLE_OPTIONS, multiScope: true, activeOptions: ['All people'] },
    ],
  },
  {
    id: 'member',
    label: ACCESS_ROLE_LABELS.member,
    count: 218,
    description: 'Can view Schedule and optionally manage their own tasks and/or time off',
    footerNote: 'Cannot access settings pages',
    configPerms: [
      { id: 'view-schedule',    label: 'View Schedule',    enabled: true,  featured: true, group: 'Schedule',  scope: 'Self', scopeOptions: ['All people'], activeOption: 'All people' },
      { id: 'log-time',         label: 'Log time',         enabled: true,  featured: true, group: 'Schedule',  scope: 'Self' },
      { id: 'manage-tasks',     label: 'Manage own tasks', enabled: true,  featured: true, group: 'Schedule',  scope: 'Self' },
      { id: 'request-time-off', label: 'Request time off', enabled: true,  featured: true, group: 'Schedule',  scope: 'Self' },
      { id: 'view-bill-rates',  label: 'View bill rates',  enabled: false, group: 'Finance' },
      { id: 'view-cost-rates',  label: 'View cost rates',  enabled: false, group: 'Finance' },
    ],
  },
]

const GROUP_ORDER = ['Projects', 'Scheduling', 'Schedule', 'Reports', 'Finance']

type DraftPerms = Record<string, ConfigPerm[]>

function permMultiScopeValues(perm: ConfigPerm): string[] {
  if (perm.multiScope) {
    return (
      perm.activeOptions ??
      (perm.activeOption != null ? [perm.activeOption] : ['All people'])
    )
  }
  return []
}

function PermRow({
  perm,
  onToggle,
  onSelectOption,
  onSelectOptions,
}: {
  perm: ConfigPerm
  onToggle: () => void
  onSelectOption: (opt: string) => void
  onSelectOptions?: (opts: string[]) => void
}) {
  const hasOptions = perm.scopeOptions && perm.scopeOptions.length > 0
  return (
    <tr className={`cfg-table__row${perm.enabled ? '' : ' cfg-table__row--off'}`}>
      <td className="cfg-table__td">
        <label className="cfg-perm-label">
          <input type="checkbox" className="perm-toggle" checked={perm.enabled} onChange={onToggle} />
          {perm.label}
        </label>
      </td>
      <td className="cfg-table__td cfg-table__td--scope">{perm.scope ?? ''}</td>
      <td className="cfg-table__td cfg-table__td--options">
        {hasOptions && perm.multiScope && perm.scopeOptions && onSelectOptions ? (
          <ScopeMultiDropdown
            options={perm.scopeOptions}
            value={permMultiScopeValues(perm)}
            onChange={onSelectOptions}
          />
        ) : hasOptions ? (
          <ScopeDropdown
            options={perm.scopeOptions!}
            value={perm.activeOption ?? perm.scopeOptions![0]}
            onChange={onSelectOption}
          />
        ) : null}
      </td>
    </tr>
  )
}

function PermGroup({
  label,
  perms,
  onToggle,
  onSelectOption,
  onSelectOptions,
}: {
  label: string
  perms: ConfigPerm[]
  onToggle: (permId: string) => void
  onSelectOption: (permId: string, opt: string) => void
  onSelectOptions?: (permId: string, opts: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const enabledCount = perms.filter((p) => p.enabled).length

  return (
    <>
      <tr className="cfg-group-row">
        <td colSpan={3}>
          <button
            type="button"
            className="cfg-group-toggle"
            onClick={() => setOpen((v) => !v)}
          >
            {open
              ? <ChevronDown size={13} strokeWidth={2} className="cfg-group-chevron" />
              : <ChevronRight size={13} strokeWidth={2} className="cfg-group-chevron" />
            }
            <span className="cfg-group-label">{label}</span>
            <span className="cfg-group-count">{enabledCount} of {perms.length} enabled</span>
          </button>
        </td>
      </tr>
      {open && perms.map((perm) => (
        <PermRow
          key={perm.id}
          perm={perm}
          onToggle={() => onToggle(perm.id)}
          onSelectOption={(opt) => onSelectOption(perm.id, opt)}
          onSelectOptions={
            onSelectOptions
              ? (opts) => onSelectOptions(perm.id, opts)
              : undefined
          }
        />
      ))}
    </>
  )
}

function ReadOnlyPermRow({ perm }: { perm: ConfigPerm }) {
  const scopeVal = perm.multiScope
    ? formatDepartmentSummary(perm.activeOptions ?? ['All people'])
    : (perm.activeOption ?? perm.scope ?? '')
  const scope = [perm.scope, scopeVal !== perm.scope ? scopeVal : null]
    .filter(Boolean).join(' · ')

  return (
    <tr className={`cfg-table__row${perm.enabled ? '' : ' cfg-table__row--off'}`}>
      <td className="cfg-table__td ro-perm-cell">
        <span className={`ro-perm-dot${perm.enabled ? ' ro-perm-dot--on' : ''}`} />
        {perm.label}
      </td>
      <td className="cfg-table__td cfg-table__td--scope ro-scope">{scope}</td>
    </tr>
  )
}

function ReadOnlyPermGroup({ label, perms }: { label: string; perms: ConfigPerm[] }) {
  const [open, setOpen] = useState(false)
  const enabledCount = perms.filter((p) => p.enabled).length
  return (
    <>
      <tr className="cfg-group-row">
        <td colSpan={2}>
          <button type="button" className="cfg-group-toggle" onClick={() => setOpen(v => !v)}>
            {open
              ? <ChevronDown size={13} strokeWidth={2} className="cfg-group-chevron" />
              : <ChevronRight size={13} strokeWidth={2} className="cfg-group-chevron" />}
            <span className="cfg-group-label">{label}</span>
            <span className="cfg-group-count">{enabledCount} of {perms.length} enabled</span>
          </button>
        </td>
      </tr>
      {open && perms.map((perm) => <ReadOnlyPermRow key={perm.id} perm={perm} />)}
    </>
  )
}

function AccessRightsPage({
  plan,
  onUpgradeToPro,
}: {
  plan: PricingPlanId
  onUpgradeToPro: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [savedPerms, setSavedPerms] = useState<DraftPerms>({})
  const [draftPerms, setDraftPerms] = useState<DraftPerms>({})
  const [confirmSaveRoleId, setConfirmSaveRoleId] = useState<string | null>(null)

  const pendingSaveRole = useMemo(
    () =>
      confirmSaveRoleId
        ? ROLES.find((r) => r.id === confirmSaveRoleId)
        : undefined,
    [confirmSaveRoleId],
  )

  useEffect(() => {
    setEditingId(null)
    setViewingId(null)
    setConfirmSaveRoleId(null)
  }, [plan])

  function startEdit(role: Role) {
    const base = savedPerms[role.id] ?? role.configPerms
    setDraftPerms((prev) => ({ ...prev, [role.id]: base.map((p) => ({ ...p })) }))
    setEditingId(role.id)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function saveEdit(roleId: string) {
    setSavedPerms((prev) => ({ ...prev, [roleId]: draftPerms[roleId] }))
    setEditingId(null)
  }

  function requestSave(roleId: string) {
    setConfirmSaveRoleId(roleId)
  }

  function confirmSave() {
    if (!confirmSaveRoleId) return
    saveEdit(confirmSaveRoleId)
    setConfirmSaveRoleId(null)
  }

  function dismissSaveConfirm() {
    setConfirmSaveRoleId(null)
  }

  useEffect(() => {
    if (!confirmSaveRoleId) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setConfirmSaveRoleId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmSaveRoleId])

  function togglePerm(roleId: string, permId: string) {
    setDraftPerms((prev) => ({
      ...prev,
      [roleId]: prev[roleId].map((p) => p.id === permId ? { ...p, enabled: !p.enabled } : p),
    }))
  }

  function selectOption(roleId: string, permId: string, option: string) {
    setDraftPerms((prev) => ({
      ...prev,
      [roleId]: prev[roleId].map((p) => p.id === permId ? { ...p, activeOption: option } : p),
    }))
  }

  function selectScopeOptions(roleId: string, permId: string, options: string[]) {
    setDraftPerms((prev) => ({
      ...prev,
      [roleId]: prev[roleId].map((p) =>
        p.id === permId ? { ...p, activeOptions: options } : p,
      ),
    }))
  }

  const canEdit = plan === 'pro'

  return (
    <div className="access-rights">
      {canEdit && pendingSaveRole && (
        <div
          className="confirm-modal-backdrop"
          role="presentation"
          onClick={dismissSaveConfirm}
        >
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-save-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="confirm-save-title" className="confirm-modal__title">
              Apply permission changes?
            </h2>
            <p className="confirm-modal__body">
              Proceeding will update permissions for all{' '}
              <strong>{pendingSaveRole.count}</strong> users assigned the{' '}
              <strong>{pendingSaveRole.label}</strong> access role. Do you want to
              continue?
            </p>
            <div className="confirm-modal__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={dismissSaveConfirm}
              >
                Cancel
              </button>
              <button type="button" className="btn btn--primary" onClick={confirmSave}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      {plan === 'starter' && (
        <div className="starter-upsell">
          <p className="starter-upsell__text">
            Need to change who can do what? Role-based access control with full editing is
            included on Pro — upgrade to adjust permissions for everyone assigned to a role.
          </p>
          <button
            type="button"
            className="btn btn--primary starter-upsell__cta"
            onClick={onUpgradeToPro}
          >
            Upgrade to Pro
          </button>
        </div>
      )}
      {canEdit && (
        <p className="access-rights__desc">
          Access roles: edit permissions here to update all users who are assigned the role,
          assign access in data hub
        </p>
      )}
      <div className="role-cards">
        {ROLES.map((role) => {
          const isEditing = canEdit && editingId === role.id
          const isViewing = !isEditing && viewingId === role.id
          const displayPerms = isEditing
            ? draftPerms[role.id]
            : (savedPerms[role.id] ?? role.configPerms)

          const featured = displayPerms?.filter((p) => p.featured) ?? []
          const groups = GROUP_ORDER.map((g) => ({
            label: g,
            perms: (displayPerms ?? []).filter((p) => !p.featured && p.group === g),
          })).filter((g) => g.perms.length > 0)

          return (
            <div key={role.id} className={`role-card${isEditing || isViewing ? ' role-card--expanded' : ''}`}>
              <div className="role-card__header">
                <button
                  type="button"
                  className="role-card__expand"
                  onClick={() => {
                    if (isEditing) return
                    setViewingId(isViewing ? null : role.id)
                  }}
                  aria-expanded={isViewing || isEditing}
                  aria-label={isViewing ? 'Collapse permissions' : 'View permissions'}
                >
                  <ChevronRight
                    size={15}
                    strokeWidth={2}
                    className={`role-card__expand-chevron${isViewing || isEditing ? ' role-card__expand-chevron--open' : ''}`}
                  />
                </button>
                <div className="role-card__body">
                  <div className="role-card__name-row">
                    <span className="role-card__name">{role.label}</span>
                    <span className="role-card__count">· {role.count} users</span>
                  </div>
                  <p className="role-card__desc">{role.description}</p>
                </div>
                {canEdit &&
                  (isEditing ? (
                    <div className="role-card__actions">
                      <button className="btn btn--ghost" type="button" onClick={cancelEdit}>
                        Cancel
                      </button>
                      <button
                        className="btn btn--primary"
                        type="button"
                        onClick={() => requestSave(role.id)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn--ghost role-card__edit"
                      type="button"
                      onClick={() => {
                        setViewingId(null)
                        startEdit(role)
                      }}
                    >
                      <Pencil size={13} strokeWidth={2} />
                      Edit
                    </button>
                  ))}
              </div>

              {isViewing && (
                <div className="role-card__table-wrap">
                  <table className="cfg-table cfg-table--readonly">
                    <thead>
                      <tr>
                        <th className="cfg-table__th">Permission</th>
                        <th className="cfg-table__th">Scope</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featured.length > 0 && (
                        <tr className="cfg-section-row">
                          <td colSpan={2} className="cfg-section-label">Defaults</td>
                        </tr>
                      )}
                      {featured.map((perm) => <ReadOnlyPermRow key={perm.id} perm={perm} />)}
                      {groups.length > 0 && (
                        <tr className="cfg-section-row cfg-section-row--divider">
                          <td colSpan={2} className="cfg-section-label">More permissions</td>
                        </tr>
                      )}
                      {groups.map((g) => (
                        <ReadOnlyPermGroup key={g.label} label={g.label} perms={g.perms} />
                      ))}
                    </tbody>
                  </table>
                  {role.footerNote && <div className="cfg-table__footer">{role.footerNote}</div>}
                </div>
              )}

              {canEdit && isEditing && (
                <div className="role-card__table-wrap">
                  <table className="cfg-table">
                    <thead>
                      <tr>
                        <th className="cfg-table__th">Configurable permissions</th>
                        <th className="cfg-table__th">Scope</th>
                        <th className="cfg-table__th">Scope options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Defaults section */}
                      {featured.length > 0 && (
                        <tr className="cfg-section-row">
                          <td colSpan={3} className="cfg-section-label">Defaults</td>
                        </tr>
                      )}
                      {featured.map((perm) => (
                        <PermRow
                          key={perm.id}
                          perm={perm}
                          onToggle={() => togglePerm(role.id, perm.id)}
                          onSelectOption={(opt) => selectOption(role.id, perm.id, opt)}
                          onSelectOptions={(opts) =>
                            selectScopeOptions(role.id, perm.id, opts)
                          }
                        />
                      ))}

                      {/* Progressive disclosure groups */}
                      {groups.length > 0 && (
                        <tr className="cfg-section-row cfg-section-row--divider">
                          <td colSpan={3} className="cfg-section-label">More permissions</td>
                        </tr>
                      )}
                      {groups.map((g) => (
                        <PermGroup
                          key={g.label}
                          label={g.label}
                          perms={g.perms}
                          onToggle={(permId) => togglePerm(role.id, permId)}
                          onSelectOption={(permId, opt) => selectOption(role.id, permId, opt)}
                          onSelectOptions={(permId, opts) =>
                            selectScopeOptions(role.id, permId, opts)
                          }
                        />
                      ))}
                    </tbody>
                  </table>
                  {role.footerNote && (
                    <div className="cfg-table__footer">{role.footerNote}</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Shell ───────────────────────────────────────────────────────────────────

const RAIL_LOCATIONS = [
  'Beaverton HQ',
  'Hilversum',
  'Shanghai',
  'New York',
  'London',
  'Sydney',
] as const

export type DataHubNavId =
  | 'offices'
  | 'people'
  | 'roles'
  | 'projects'
  | 'clients'
  | 'rate-cards'
  | 'activity'

const DATA_HUB_PLACEHOLDER: Record<DataHubNavId, string> = {
  offices: 'Offices',
  people: 'People',
  roles: 'Roles',
  projects: 'Projects',
  clients: 'Clients',
  'rate-cards': 'Rate cards',
  activity: 'Activity log',
}

function AppRail({
  onOpenSettings,
  dataHubActive,
  onDataHubActiveChange,
}: {
  onOpenSettings: () => void
  dataHubActive: DataHubNavId
  onDataHubActiveChange: (id: DataHubNavId) => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [globalOpen, setGlobalOpen] = useState(true)
  const [gridOpen, setGridOpen] = useState(true)
  const [logoMenuOpen, setLogoMenuOpen] = useState(false)
  const logoMenuRef = useRef<HTMLDivElement>(null)

  const iconSize = 16
  const iconStroke = 1.75

  useEffect(() => {
    if (!logoMenuOpen) return
    function onDocMouseDown(e: MouseEvent) {
      if (logoMenuRef.current && !logoMenuRef.current.contains(e.target as Node)) {
        setLogoMenuOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLogoMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [logoMenuOpen])

  function goToSettings() {
    setLogoMenuOpen(false)
    onOpenSettings()
  }

  return (
    <aside
      className={`app-rail${collapsed ? ' app-rail--collapsed' : ''}`}
      aria-label="Product navigation"
    >
      <header className="app-rail__header">
        <div className="app-rail__brand-wrap" ref={logoMenuRef}>
          <button
            type="button"
            className={`app-rail__brand${logoMenuOpen ? ' app-rail__brand--open' : ''}`}
            aria-label="Workspace menu"
            aria-expanded={logoMenuOpen}
            aria-haspopup="menu"
            onClick={() => setLogoMenuOpen((o) => !o)}
          >
            <svg
              className="app-rail__brand-mark"
              viewBox="0 0 48 18"
              aria-hidden
            >
              <path
                d="M2 14 Q14 2 28 10 Q36 14 46 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
            <ChevronDown size={14} strokeWidth={2} className="app-rail__brand-chevron" aria-hidden />
          </button>
          {logoMenuOpen && (
            <div className="workspace-menu" role="menu" aria-label="Workspace">
              <button
                type="button"
                className="workspace-menu__row"
                role="menuitem"
                onClick={goToSettings}
              >
                <span className="workspace-menu__label">Settings</span>
                <span className="workspace-menu__hint">G then S</span>
              </button>
              <div className="workspace-menu__sep" role="separator" />
              <button
                type="button"
                className="workspace-menu__row workspace-menu__row--with-chevron"
                role="menuitem"
                onClick={() => setLogoMenuOpen(false)}
              >
                <span className="workspace-menu__label">Switch workspace</span>
                <span className="workspace-menu__right">
                  <span className="workspace-menu__hint">O then W</span>
                  <ChevronRight size={16} strokeWidth={2} className="workspace-menu__chev" aria-hidden />
                </span>
              </button>
              <div className="workspace-menu__sep" role="separator" />
              <button
                type="button"
                className="workspace-menu__row"
                role="menuitem"
                onClick={() => setLogoMenuOpen(false)}
              >
                <span className="workspace-menu__label">Log out</span>
                <span className="workspace-menu__keys" aria-label="Option Shift Q">
                  <kbd className="workspace-menu__key">⌥</kbd>
                  <kbd className="workspace-menu__key">⇧</kbd>
                  <kbd className="workspace-menu__key">Q</kbd>
                </span>
              </button>
            </div>
          )}
        </div>
        <div className="app-rail__header-tools">
          <button type="button" className="app-rail__notif" aria-label="23 unread notifications">
            <Bell size={16} strokeWidth={1.75} aria-hidden />
            <span className="app-rail__notif-badge">23</span>
          </button>
          <button
            type="button"
            className="app-rail__collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {collapsed ? (
              <PanelLeft size={18} strokeWidth={1.75} aria-hidden />
            ) : (
              <PanelLeftClose size={18} strokeWidth={1.75} aria-hidden />
            )}
          </button>
        </div>
      </header>

      <nav className="app-rail__scroll" aria-label="Primary">
        <div className="app-rail__block">
          <button
            type="button"
            className="app-rail__section-head"
            onClick={() => setGlobalOpen((o) => !o)}
            aria-expanded={globalOpen}
          >
            <BookOpen size={iconSize} strokeWidth={iconStroke} className="app-rail__ico" aria-hidden />
            <span className="app-rail__section-label">Global</span>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className={`app-rail__chev${globalOpen ? ' app-rail__chev--open' : ''}`}
              aria-hidden
            />
          </button>
          {globalOpen && (
            <div className="app-rail__indent">
              <button type="button" className="app-rail__row">
                <LayoutDashboard size={iconSize} strokeWidth={iconStroke} className="app-rail__ico" aria-hidden />
                <span className="app-rail__row-label">Dashboard</span>
              </button>
              <button type="button" className="app-rail__row">
                <BarChart3 size={iconSize} strokeWidth={iconStroke} className="app-rail__ico" aria-hidden />
                <span className="app-rail__row-label">Report</span>
              </button>
            </div>
          )}
        </div>

        <div className="app-rail__block app-rail__block--locations">
          {RAIL_LOCATIONS.map((name) => (
            <button key={name} type="button" className="app-rail__location">
              <BookOpen size={iconSize} strokeWidth={iconStroke} className="app-rail__ico" aria-hidden />
              <span className="app-rail__row-label">{name}</span>
              <ChevronUp size={16} strokeWidth={2} className="app-rail__chev-loc" aria-hidden />
            </button>
          ))}
        </div>

        <div className="app-rail__block">
          <button type="button" className="app-rail__row">
            <Star size={iconSize} strokeWidth={iconStroke} className="app-rail__ico" aria-hidden />
            <span className="app-rail__row-label">Skills graph</span>
          </button>
          <button type="button" className="app-rail__row">
            <Share2 size={iconSize} strokeWidth={iconStroke} className="app-rail__ico" aria-hidden />
            <span className="app-rail__row-label">Talent graph</span>
          </button>
          <button type="button" className="app-rail__row">
            <Waypoints size={iconSize} strokeWidth={iconStroke} className="app-rail__ico" aria-hidden />
            <span className="app-rail__row-label">Project graph</span>
          </button>
        </div>

        <div className="app-rail__block">
          <button
            type="button"
            className="app-rail__section-head"
            onClick={() => setGridOpen((o) => !o)}
            aria-expanded={gridOpen}
          >
            <Database size={iconSize} strokeWidth={iconStroke} className="app-rail__ico" aria-hidden />
            <span className="app-rail__section-label">Data hub</span>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className={`app-rail__chev${gridOpen ? ' app-rail__chev--open' : ''}`}
              aria-hidden
            />
          </button>
          {gridOpen && (
            <div className="app-rail__subnav">
              <div className="app-rail__subnav-line" aria-hidden />
              <div className="app-rail__subnav-rows">
                {(
                  [
                    { id: 'offices' as const, label: 'Offices', Icon: BookOpen },
                    { id: 'people' as const, label: 'People', Icon: Users },
                    { id: 'roles' as const, label: 'Roles', Icon: GraduationCap },
                    { id: 'projects' as const, label: 'Projects', Icon: Folder },
                    { id: 'clients' as const, label: 'Clients', Icon: Building2 },
                    { id: 'rate-cards' as const, label: 'Rate cards', Icon: DollarSign },
                    { id: 'activity' as const, label: 'Activity log', Icon: Clock },
                  ] as const
                ).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={`app-rail__subrow${dataHubActive === id ? ' app-rail__subrow--active' : ''}`}
                    onClick={() => onDataHubActiveChange(id)}
                    aria-current={dataHubActive === id ? 'page' : undefined}
                  >
                    <Icon size={iconSize} strokeWidth={iconStroke} className="app-rail__ico" aria-hidden />
                    <span className="app-rail__row-label">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}

function NavBullet({ active }: { active: boolean }) {
  return (
    <span className="nav-row__bullet" aria-hidden>
      <Circle size={14} strokeWidth={1.5} className="nav-row__bullet-ring" />
      {active ? <span className="nav-row__bullet-fill" /> : null}
    </span>
  )
}

export default function App() {
  const [dataHubNavId, setDataHubNavId] = useState<DataHubNavId>('people')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pricingPlan, setPricingPlan] = useState<PricingPlanId>('pro')
  const [activeOrgId, setActiveOrgId] = useState<string | null>('access')
  const [expandedOfficeId, setExpandedOfficeId] = useState<string | null>('beaverton')
  const [officesUpsellOpen, setOfficesUpsellOpen] = useState(false)
  const [active, setActive] = useState<OfficeNavActive>({
    mode: 'section',
    officeId: 'beaverton',
    childId: 'policies',
  })

  const orgNavItems = useMemo(() => orgNavForPlan(pricingPlan), [pricingPlan])

  const officeLabelById = useMemo(
    () => Object.fromEntries(OFFICES.map((o) => [o.id, o.label])),
    [],
  )

  useEffect(() => {
    const allowed = new Set<string>(orgNavItems.map((i) => i.id))
    if (activeOrgId != null && !allowed.has(activeOrgId)) {
      setActiveOrgId('access')
    }
  }, [pricingPlan, orgNavItems, activeOrgId])

  /** Starter: office routes aren’t available — return to org nav if user was on an office view. */
  useEffect(() => {
    if (pricingPlan !== 'starter') return
    if (activeOrgId === null) {
      setActiveOrgId('access')
    }
  }, [pricingPlan, activeOrgId])

  useEffect(() => {
    if (pricingPlan !== 'starter') setOfficesUpsellOpen(false)
  }, [pricingPlan])

  useEffect(() => {
    if (!officesUpsellOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOfficesUpsellOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [officesUpsellOpen])

  useEffect(() => {
    if (!settingsOpen) return
    const el = document.getElementById('settings-sidebar')
    requestAnimationFrame(() => {
      el?.focus({ preventScroll: true })
    })
  }, [settingsOpen])

  const activeOfficeLabel = officeLabelById[active.officeId] ?? ''

  const officeTitle =
    active.mode === 'overview'
      ? 'Overview'
      : (OFFICE_SUBITEMS.find((s) => s.id === active.childId)?.label ?? 'Policies')

  const orgTitle = activeOrgId
    ? (ORG_NAV.find((n) => n.id === activeOrgId)?.label ?? '')
    : ''

  const mainTitle = activeOrgId ? orgTitle : officeTitle
  const mainContext = activeOrgId ? 'Company settings' : activeOfficeLabel

  const emptyPanelMessage = activeOrgId
    ? `${orgTitle} settings will appear here.`
    : active.mode === 'overview'
      ? 'Overview content for this office will appear here.'
      : `${officeTitle} settings will appear here.`

  function selectOrgItem(id: string) {
    setActiveOrgId(id)
  }

  function toggleOfficeExpand(officeId: string) {
    setExpandedOfficeId((prev) => (prev === officeId ? null : officeId))
  }

  function selectOfficeOverview(officeId: string) {
    setActiveOrgId(null)
    setActive({ mode: 'overview', officeId })
    setExpandedOfficeId(officeId)
  }

  return (
    <div className="app-shell">
      <AppRail
        onOpenSettings={() => setSettingsOpen(true)}
        dataHubActive={dataHubNavId}
        onDataHubActiveChange={setDataHubNavId}
      />
      {officesUpsellOpen && (
        <div
          className="offices-upsell-backdrop"
          role="presentation"
          onClick={() => setOfficesUpsellOpen(false)}
        >
          <div
            className="offices-upsell-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="offices-upsell-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="offices-upsell-title" className="offices-upsell-modal__title">
              Offices are included on Pro
            </h2>
            <p className="offices-upsell-modal__lede">
              Represent each site, studio, or entity in one workspace. On Pro you can open an
              office in the sidebar and manage its own policies, access, schedules, currencies,
              time tracking, and time off — without changing everyone else’s defaults.
            </p>
            <ul className="offices-upsell-modal__list">
              <li>
                <strong>Add offices</strong> for every location your team works from.
              </li>
              <li>
                <strong>Switch context</strong> in the sidebar to edit settings for just that
                office.
              </li>
              <li>
                <strong>Keep org-wide rules</strong> under Organization, and layer office
                specifics where they matter.
              </li>
            </ul>
            <div className="offices-upsell-modal__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setOfficesUpsellOpen(false)}
              >
                Not now
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  setPricingPlan('pro')
                  setOfficesUpsellOpen(false)
                }}
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}
      {!settingsOpen && (
        <main className="main">
          {dataHubNavId === 'people' ? (
            <DataHubPeoplePage />
          ) : (
            <div className="shell-placeholder" role="status">
              <p className="shell-placeholder__text">
                <strong>{DATA_HUB_PLACEHOLDER[dataHubNavId]}</strong> — this section will appear here.
                Open the workspace menu (logo) and choose <strong>Settings</strong> for organization
                options.
              </p>
            </div>
          )}
        </main>
      )}
      {settingsOpen && (
        <div
          className="settings-fullpage"
          id="settings-sidebar"
          tabIndex={-1}
        >
          <header className="settings-fullpage__header">
            <button
              type="button"
              className="settings-fullpage__back"
              onClick={() => setSettingsOpen(false)}
              aria-label="Back"
            >
              <ArrowLeft size={22} strokeWidth={2} aria-hidden />
            </button>
            <div className="settings-fullpage__heading">
              <h1 className="settings-fullpage__title">Settings</h1>
              <PlanDropdown value={pricingPlan} onChange={setPricingPlan} />
            </div>
          </header>

          <div className="settings-fullpage__split">
            <div className="settings-fullpage__nav" aria-label="Settings sections">
              <div>
                <p className="sidebar__section-label">Organization</p>
                <nav className="sidebar__nav" aria-label="Organization settings">
                  {orgNavItems.map((item) => {
                    const isActive = activeOrgId === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`nav-row${isActive ? ' nav-row--active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => selectOrgItem(item.id)}
                      >
                        <NavBullet active={isActive} />
                        <span className="nav-row__label">{item.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              <div>
                {pricingPlan === 'starter' ? (
                  <button
                    type="button"
                    className="sidebar__offices-starter-title"
                    onClick={() => setOfficesUpsellOpen(true)}
                    aria-haspopup="dialog"
                  >
                    <span className="sidebar__section-label sidebar__section-label--inline">Offices</span>
                    <span className="sidebar__pro-pill" title="Included on Pro">
                      Pro
                    </span>
                  </button>
                ) : (
                  <>
                    <div className="sidebar__section-label-row">
                      <p className="sidebar__section-label sidebar__section-label--inline">Offices</p>
                    </div>
                    <div className="sidebar__nav">
                      {OFFICES.map((office) => {
                        const isExpanded = expandedOfficeId === office.id
                        const overviewActive =
                          !activeOrgId &&
                          active.mode === 'overview' &&
                          active.officeId === office.id
                        return (
                          <div key={office.id} className="office-group">
                            <div
                              className={`office-row${overviewActive ? ' office-row--office-active' : ''}`}
                            >
                              <button
                                type="button"
                                className="office-row__main"
                                onClick={() => selectOfficeOverview(office.id)}
                                aria-current={overviewActive ? 'page' : undefined}
                              >
                                <NavBullet active={overviewActive} />
                                <span className="nav-row__label">{office.label}</span>
                              </button>
                              <button
                                type="button"
                                className="office-row__toggle"
                                onClick={() => toggleOfficeExpand(office.id)}
                                aria-expanded={isExpanded}
                                aria-label={
                                  isExpanded
                                    ? `Collapse ${office.label} sections`
                                    : `Expand ${office.label} sections`
                                }
                              >
                                {isExpanded ? (
                                  <ChevronDown
                                    className="nav-row__chevron"
                                    size={18}
                                    strokeWidth={2}
                                    aria-hidden
                                  />
                                ) : (
                                  <ChevronRight
                                    className="nav-row__chevron"
                                    size={18}
                                    strokeWidth={2}
                                    aria-hidden
                                  />
                                )}
                              </button>
                            </div>
                            {isExpanded && (
                              <div
                                className="office-group__nested"
                                role="group"
                                aria-label={office.label}
                              >
                                {OFFICE_SUBITEMS.map((item) => {
                                  const isActive =
                                    !activeOrgId &&
                                    active.mode === 'section' &&
                                    active.officeId === office.id &&
                                    active.childId === item.id
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      className={`nav-row nav-row--nested${isActive ? ' nav-row--active' : ''}`}
                                      aria-current={isActive ? 'page' : undefined}
                                      onClick={() => {
                                        setActiveOrgId(null)
                                        setActive({
                                          mode: 'section',
                                          officeId: office.id,
                                          childId: item.id,
                                        })
                                      }}
                                    >
                                      <NavBullet active={isActive} />
                                      <span className="nav-row__label">{item.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="settings-fullpage__content">
              <header className="page-header">
                <h2 className="page-header__title">{mainTitle}</h2>
                <p className="page-header__context">{mainContext}</p>
              </header>

              {activeOrgId === 'access' ? (
                <AccessRightsPage
                  plan={pricingPlan}
                  onUpgradeToPro={() => setPricingPlan('pro')}
                />
              ) : (
                <div className="empty-panel" role="status" aria-live="polite">
                  <p className="empty-panel__text">{emptyPanelMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
