export const costByService = (services) => {
    return services.reduce((s, item) => {
        if (item.plannerOptions.length > 0 && item.selectedPlannerOption > 0) {
            const selectedAlternative = item.plannerOptions[item.selectedPlannerOption - 1];
            return item.isComplimentary ? s : s + selectedAlternative.qty * selectedAlternative.price;
        } else {
            return item.isComplimentary ? s : s + item.requirementValue * item.price;
        }
    }, 0);
}

export const extraCost = (services) => {
    return services.reduce((s, service) => {
        if (!service.addedOnProposal) return s;
        return s + service.requirementValue * service.price;
    }, 0);
}

export const discounting = (cost, {price, percentage}) => {

    let discount = percentage ? Math.round((cost * percentage) / 100) : price;

    return cost - discount;
}

export const addingTax = (cost, {price, percentage}) => {
    let tax = percentage ? Math.round((cost * percentage) / 100) : price;

    return cost + tax;
}

