export default {
    route: state => state.route,
    account: state => state.account,
    error: state => state.error,
    pending: state => state.pending,
    success: state => state.success,
    permission: state => (resource, action, context) => {
        if (!state.account || !resource || !action) {
            return false;
        }
        switch (resource) {
            case 'orgnizations':
                switch (action) {
                    case 'list':
                        return /^(Super)?Admin$/.test(state.account.role);
                    case 'show':
                        return /^(Super)?Admin$/.test(state.account.role) || context && (state.account.org._id === context || state.account.org._id === context._id);
                    case 'update':
                        return /^(Super)?Admin$/.test(state.account.role) || context && /^Client$/.test(state.account.role) && state.account.org._id === context._id;
                    case 'create':
                    case 'remove':
                        return /^SuperAdmin$/.test(state.account.role);
                    default:
                        return false;
                }
            case 'users':
                switch (action) {
                    case 'list':
                        return /^(Super)?Admin$/.test(state.account.role) || context && state.account.org._id === context._id;
                    case 'show':
                        return /^(Super)?Admin$/.test(state.account.role) || context && (state.account.org._id === context.org || state.account.org._id === context.org._id);
                    case 'create':
                        return /^(Super)?Admin$/.test(state.account.role) || /^Client$/.test(state.account.role) && context && (state.account.org._id === context || state.account.org._id === context._id);
                    case 'update':
                        return /^SuperAdmin$/.test(state.account.role) || context && (/^Admin$/.test(state.account.role) && /^Client|Member$/.test(context.role) || /^Client$/.test(state.account.role) && (state.account.org._id === context.org || state.account.org._id === context.org._id) && /^Member$/.test(context.role) || state.account._id === context._id);
                    case 'remove':
                        return /^SuperAdmin$/.test(state.account.role) || context && (/^Admin$/.test(state.account.role) && /^Client|Member$/.test(context.role) || /^Client$/.test(state.account.role) && (state.account.org._id === context.org || state.account.org._id === context.org._id) && /^Member$/.test(context.role));
                    case 'option':
                        return /^(Super)?Admin$/.test(state.account.role) ? (context && /^(Super)?Admin$/.test(context) ? /^SuperAdmin$/.test(state.account.role) : true) : false;
                    default:
                        return false;
                }
            case 'serials':
                switch (action) {
                    case 'list':
                    case 'generate':
                    case 'remove':
                    case 'clear':
                        return /^(Super)?Admin$/.test(state.account.role);
                    default:
                        return false;
                }
            case 'storage':
                switch (action) {
                    case 'show':
                    case 'download':
                    case 'abort':
                        return /^(Super)?Admin$/.test(state.account.role) || context && (state.account.org._id === context.org || state.account.org._id === context.org._id);
                    case 'upload':
                    case 'move':
                    case 'rename':
                    case 'remove':
                    case 'bulkRemove':
                        return /^(Super)?Admin$/.test(state.account.role) || context && (state.account.org._id === context.org || state.account.org._id === context.org._id) && (/^Client$/.test(state.account.role) || state.account._id === context._id);
                    default:
                        return false;
                }
            default:
                return false;
        }
    }
}