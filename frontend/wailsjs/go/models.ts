export namespace db {
	
	export class Investment {
	    id: number;
	    account_id: number;
	    name: string;
	    category: string;
	    amount: number;
	    currency: string;
	
	    static createFrom(source: any = {}) {
	        return new Investment(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.account_id = source["account_id"];
	        this.name = source["name"];
	        this.category = source["category"];
	        this.amount = source["amount"];
	        this.currency = source["currency"];
	    }
	}
	export class Account {
	    id: number;
	    name: string;
	    holder: string;
	    cash: number;
	    cash_currency: string;
	    investments: Investment[];
	
	    static createFrom(source: any = {}) {
	        return new Account(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.holder = source["holder"];
	        this.cash = source["cash"];
	        this.cash_currency = source["cash_currency"];
	        this.investments = this.convertValues(source["investments"], Investment);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

