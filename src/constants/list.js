export const CUSTOMER_PAGE_TABS = [
    { key: "all", value: 0, title: "All customers", icon: "Group 19735.svg", class: "color-purple" },
    { key: "returning", value: 1, title: "Returning", icon: "Path 3984.svg", class: "color-black-middle" },
    { key: "new", value: 2, title: "New", icon: "Group 19776.svg", class:"color-black-middle" },
    { key: "potential", value: 3, title: "Potential", icon: "Group 19780.svg", class: "color-blue" },
]

export const CUSTOMER_TABLE_HEADERS = [
    { key: "", title: "" },
    { key: "name", title: "Name" },
    { key: "ein", title: "EIN" },
    { key: "incomes", title: "Incomes" },
    { key: "contact", title: "Contact" },
    { key: "bids", title: "Bids" },
    { key: "status", title: "Status" },
    { key: "", title: "" },
]

export const PROPOSAL_PAGE_TABS = [
    { key: "all", value: 'all', title: "All Proposal", icon: "proposal-active.svg", class: "color-vendor" },
    { key: "won", value: 2, title: "I won", icon: "filter-won.svg", class: "color-won" },
    { key: "draft", value: 0, title: "Drafts", icon: "filter-draft.svg" },
    { key: "submit", value: 1, title: "Pending", icon: "filter-pending.svg" },
    { key: "top", value: 3, title: "Made Top3", icon: "filter-top3.svg" },
    { key: "lost", value: 4, title: "Lost Bids", icon: "filter-reject.svg" },
]

export const PROPOSAL_TABLE_HEADERS = [
    { key: "", title: "" },
    { key: "name", title: "Name" },
    { key: "date", title: "Date" },
    { key: "cost", title: "Proposal Value" },
    { key: "modified", title: "Modified" },
    { key: "status", title: "Status" },
    { key: "owner", title: "Owner" },
    { key: "update", title: "Update", class: "text-center" },
    { key: "", title: "" },
]

