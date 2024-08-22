export const fetcher = (arg: any, params: any) => fetch(arg, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        ...params,
    },
}).then(r => r.json());
