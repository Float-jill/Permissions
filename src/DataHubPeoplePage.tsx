import { useEffect, useState } from 'react'
import {
  ChevronDown,
  Circle,
  Filter,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react'
import { accessRoleLabel, type AccessRoleId } from './accessRoles'

const CATEGORY_TABS = [
  { id: 'employees', label: 'Employees' },
  { id: 'contractors', label: 'Contractors' },
  { id: 'departments', label: 'Departments' },
  { id: 'delivery', label: 'Delivery teams' },
  { id: 'groups', label: 'Groups' },
] as const

const STATUS_FILTERS = [
  { id: 'active', label: '64 Active' },
  { id: 'archived', label: '0 Archived' },
  { id: 'all', label: 'All' },
] as const

type CategoryId = (typeof CATEGORY_TABS)[number]['id']
type StatusFilterId = (typeof STATUS_FILTERS)[number]['id']

export interface PeopleRow {
  id: string
  name: string
  /** Job title / function (e.g. Designer) — not the same as access role. */
  role: string
  /** Matches Settings → Access rights roles (Admin, Project manager, …). */
  accessRoleId: AccessRoleId
  department: string
  deliveryTeam: string
  groups: string[]
  office: string
  email: string
  /** Projects this person can view — Access tab. */
  projectCanView: string[]
  /** Projects this person can edit — Access tab. */
  projectCanEdit: string[]
}

const PERSON_PANEL_TABS = [
  { id: 'info' as const, label: 'Info' },
  { id: 'access' as const, label: 'Access' },
  { id: 'availability' as const, label: 'Availability' },
  { id: 'timeoff' as const, label: 'Time off', badge: 8 },
  { id: 'projects' as const, label: 'Projects', badge: 76 },
  { id: 'manages' as const, label: 'Manages' },
]

type PersonPanelTabId = (typeof PERSON_PANEL_TABS)[number]['id']

/** Wireframe sample: project lists shared across demo rows (white mock). */
const DEFAULT_PROJECT_VIEW = ['Build a house', 'Build a car', 'Build a spaceship']
const DEFAULT_PROJECT_EDIT = ['Build a fish']

const SAMPLE_PEOPLE: PeopleRow[] = [
  {
    id: '1',
    name: 'Jake Peralta',
    role: 'Designer',
    department: 'Design',
    deliveryTeam: 'Acquisition',
    groups: ['Leadership'],
    office: 'New York',
    email: 'jake.peralta@example.com',
    accessRoleId: 'resource-planner',
    projectCanView: DEFAULT_PROJECT_VIEW,
    projectCanEdit: DEFAULT_PROJECT_EDIT,
  },
  {
    id: '2',
    name: 'Amy Santiago',
    role: 'Senior Designer',
    department: 'Design',
    deliveryTeam: 'Retention',
    groups: ['Hiring committee'],
    office: 'New York',
    email: 'amy.santiago@example.com',
    accessRoleId: 'project-manager',
    projectCanView: DEFAULT_PROJECT_VIEW,
    projectCanEdit: DEFAULT_PROJECT_EDIT,
  },
  {
    id: '3',
    name: 'Rosa Diaz',
    role: 'Developer',
    department: 'Engineering',
    deliveryTeam: 'Core',
    groups: [],
    office: 'Sydney',
    email: 'rosa.diaz@example.com',
    accessRoleId: 'admin',
    projectCanView: DEFAULT_PROJECT_VIEW,
    projectCanEdit: DEFAULT_PROJECT_EDIT,
  },
  {
    id: '4',
    name: 'Terry Jeffords',
    role: 'Engineering Manager',
    department: 'Engineering',
    deliveryTeam: 'Core',
    groups: ['Leadership', 'AI working group'],
    office: 'New York',
    email: 'terry.jeffords@example.com',
    accessRoleId: 'admin',
    projectCanView: DEFAULT_PROJECT_VIEW,
    projectCanEdit: DEFAULT_PROJECT_EDIT,
  },
  {
    id: '5',
    name: 'Charles Boyle',
    role: 'Designer',
    department: 'Design',
    deliveryTeam: 'Creative studio',
    groups: [],
    office: 'Melbourne',
    email: 'charles.boyle@example.com',
    accessRoleId: 'resource-planner',
    projectCanView: DEFAULT_PROJECT_VIEW,
    projectCanEdit: DEFAULT_PROJECT_EDIT,
  },
  {
    id: '6',
    name: 'Gina Linetti',
    role: 'Operations Lead',
    department: 'Operations',
    deliveryTeam: 'Acquisition',
    groups: ['Leadership'],
    office: 'London',
    email: 'gina.linetti@example.com',
    accessRoleId: 'project-manager',
    projectCanView: DEFAULT_PROJECT_VIEW,
    projectCanEdit: DEFAULT_PROJECT_EDIT,
  },
  {
    id: '7',
    name: 'Raymond Holt',
    role: 'Principal Designer',
    department: 'Design',
    deliveryTeam: 'Retention',
    groups: ['Leadership', 'Hiring committee'],
    office: 'New York',
    email: 'raymond.holt@example.com',
    accessRoleId: 'admin',
    projectCanView: DEFAULT_PROJECT_VIEW,
    projectCanEdit: DEFAULT_PROJECT_EDIT,
  },
  {
    id: '8',
    name: 'Norm Scully',
    role: 'Developer',
    department: 'Engineering',
    deliveryTeam: 'Core',
    groups: [],
    office: 'Sydney',
    email: 'norm.scully@example.com',
    accessRoleId: 'member',
    projectCanView: DEFAULT_PROJECT_VIEW,
    projectCanEdit: DEFAULT_PROJECT_EDIT,
  },
]

function nameInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?'
}

export function DataHubPeoplePage() {
  const [category, setCategory] = useState<CategoryId>('employees')
  const [statusFilter, setStatusFilter] = useState<StatusFilterId>('active')
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null)
  const [personPanelTab, setPersonPanelTab] = useState<PersonPanelTabId>('access')

  const selectedPerson = selectedPersonId
    ? SAMPLE_PEOPLE.find((p) => p.id === selectedPersonId) ?? null
    : null

  function openPerson(id: string) {
    setSelectedPersonId(id)
    setPersonPanelTab('access')
  }

  function closePersonPanel() {
    setSelectedPersonId(null)
  }

  useEffect(() => {
    if (!selectedPersonId) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelectedPersonId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedPersonId])

  return (
    <>
    <div className="dh-people">
      <div className="dh-people__toolbar">
        <div className="dh-people__toolbar-left">
          <div className="dh-people__title-row">
            <h1 className="dh-people__title">64 Employees</h1>
            <button type="button" className="dh-people__filter-btn">
              <Filter size={16} strokeWidth={2} aria-hidden />
              Filter
            </button>
          </div>
        </div>
        <div className="dh-people__top-actions">
          <button type="button" className="dh-people__icon-add" aria-label="Add employee">
            <Plus size={22} strokeWidth={2} />
          </button>
          <button type="button" className="dh-people__import">
            <RefreshCw size={16} strokeWidth={2} aria-hidden />
            Import/Export
          </button>
        </div>
      </div>

      <div className="dh-people__tabs-wrap">
        <button type="button" className="dh-people__office-dd">
          All offices
          <ChevronDown size={14} strokeWidth={2} aria-hidden />
        </button>
        <div className="dh-people__tabs" role="tablist" aria-label="People categories">
          {CATEGORY_TABS.map((tab) => {
            const isActive = category === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`dh-people__tab${isActive ? ' dh-people__tab--active' : ''}`}
                onClick={() => setCategory(tab.id)}
              >
                {isActive ? (
                  <Circle className="dh-people__tab-dot" size={6} fill="currentColor" aria-hidden />
                ) : null}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="dh-people__subfilters">
        <button type="button" className="dh-people__subfilter-plus" aria-label="Add filter">
          <Plus size={16} strokeWidth={2} />
        </button>
        <div className="dh-people__status-chips" role="group" aria-label="Status">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`dh-people__chip${statusFilter === s.id ? ' dh-people__chip--active' : ''}`}
              onClick={() => setStatusFilter(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dh-people__table-wrap">
        <table className="dh-people__table">
          <thead>
            <tr>
              <th className="dh-people__th dh-people__th--check" scope="col">
                <span className="sr-only">Select</span>
              </th>
              <th className="dh-people__th" scope="col">
                Name
              </th>
              <th className="dh-people__th" scope="col">
                <button type="button" className="dh-people__th-btn">
                  Role
                  <ChevronDown size={14} strokeWidth={2} aria-hidden />
                </button>
              </th>
              <th className="dh-people__th" scope="col">
                Access
              </th>
              <th className="dh-people__th" scope="col">
                <button type="button" className="dh-people__th-btn">
                  Department
                  <ChevronDown size={14} strokeWidth={2} aria-hidden />
                </button>
              </th>
              <th className="dh-people__th" scope="col">
                <button type="button" className="dh-people__th-btn">
                  Delivery Team
                  <ChevronDown size={14} strokeWidth={2} aria-hidden />
                </button>
              </th>
              <th className="dh-people__th" scope="col">
                Group
              </th>
              <th className="dh-people__th" scope="col">
                Office
              </th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_PEOPLE.map((row) => (
              <tr
                key={row.id}
                className={`dh-people__row${selectedPersonId === row.id ? ' dh-people__row--selected' : ''}`}
                onClick={() => openPerson(row.id)}
              >
                <td className="dh-people__td dh-people__td--check">
                  <input
                    type="checkbox"
                    className="dh-people__checkbox"
                    aria-label={`Select ${row.name}`}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="dh-people__td">
                  <span className="dh-people__name-cell">{row.name}</span>
                </td>
                <td className="dh-people__td">{row.role}</td>
                <td className="dh-people__td dh-people__td--access">
                  {accessRoleLabel(row.accessRoleId)}
                </td>
                <td className="dh-people__td">{row.department}</td>
                <td className="dh-people__td">{row.deliveryTeam}</td>
                <td className="dh-people__td">
                  <div className="dh-people__group-pills">
                    {row.groups.map((g) => (
                      <span key={g} className="dh-people__pill">
                        {g}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="dh-people__td">{row.office}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {selectedPerson && (
      <>
        <div
          className="person-panel__backdrop"
          role="presentation"
          aria-hidden
          onClick={closePersonPanel}
        />
        <aside
          className="person-panel"
          aria-label={`${selectedPerson.name} profile`}
          id="person-side-panel"
        >
          <header className="person-panel__header">
            <div className="person-panel__header-text">
              <h2 className="person-panel__name">{selectedPerson.name}</h2>
              <p className="person-panel__email">{selectedPerson.email}</p>
            </div>
            <div className="person-panel__header-actions">
              <div className="person-panel__avatar" aria-hidden>
                {nameInitial(selectedPerson.name)}
              </div>
              <button
                type="button"
                className="person-panel__close"
                onClick={closePersonPanel}
                aria-label="Close panel"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>
          </header>

          <div className="person-panel__tabs" role="tablist" aria-label="Person sections">
            {PERSON_PANEL_TABS.map((tab) => {
              const isActive = personPanelTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`person-panel__tab${isActive ? ' person-panel__tab--active' : ''}`}
                  onClick={() => setPersonPanelTab(tab.id)}
                >
                  {tab.label}
                  {'badge' in tab && tab.badge != null ? (
                    <span className="person-panel__tab-badge">{tab.badge}</span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="person-panel__body">
            {personPanelTab === 'access' && (
              <div className="person-panel__access">
                <section className="person-panel__card" aria-labelledby="person-access-role-heading">
                  <p id="person-access-role-heading" className="person-panel__card-label">
                    Access role
                  </p>
                  <p className="person-panel__card-value">
                    {accessRoleLabel(selectedPerson.accessRoleId)}
                  </p>
                </section>

                <section className="person-panel__card person-panel__card--access" aria-labelledby="project-access-heading">
                  <h3 id="project-access-heading" className="person-panel__section-title">
                    Project access (active projects)
                  </h3>
                  <div className="person-panel__access-block">
                    <p className="person-panel__access-sub">Can view</p>
                    <ul className="person-panel__list">
                      {selectedPerson.projectCanView.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="person-panel__access-block">
                    <p className="person-panel__access-sub">Can edit</p>
                    <ul className="person-panel__list">
                      {selectedPerson.projectCanEdit.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>
            )}

            {personPanelTab === 'info' && (
              <div className="person-panel__placeholder">
                <p className="person-panel__muted">
                  Name, role, rates, department, tags, and type — as in the profile editor.
                </p>
              </div>
            )}

            {personPanelTab === 'availability' && (
              <div className="person-panel__placeholder">
                <p className="person-panel__muted">Availability schedule will appear here.</p>
              </div>
            )}

            {personPanelTab === 'timeoff' && (
              <div className="person-panel__placeholder">
                <p className="person-panel__muted">Time off history and balances will appear here.</p>
              </div>
            )}

            {personPanelTab === 'projects' && (
              <div className="person-panel__placeholder">
                <p className="person-panel__muted">All linked projects will appear here.</p>
              </div>
            )}

            {personPanelTab === 'manages' && (
              <div className="person-panel__placeholder">
                <p className="person-panel__muted">People and teams this person manages.</p>
              </div>
            )}
          </div>

          <footer className="person-panel__footer">
            <div className="person-panel__footer-left">
              <button type="button" className="btn btn--primary">
                Update person
              </button>
              <button type="button" className="btn btn--ghost" onClick={closePersonPanel}>
                Cancel
              </button>
            </div>
            <button type="button" className="person-panel__actions-link">
              Actions
              <ChevronDown size={14} strokeWidth={2} aria-hidden />
            </button>
          </footer>
        </aside>
      </>
    )}
    </>
  )
}
