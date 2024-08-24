export namespace main {
	
	export class investment {
	    name: string;
	    category: string;
	    amount: number;
	
	    static createFrom(source: any = {}) {
	        return new investment(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.category = source["category"];
	        this.amount = source["amount"];
	    }
	}
	export class account {
	    id: number;
	    name: string;
	    holder: string;
	    cash: number;
	    investments: investment[];
	
	    static createFrom(source: any = {}) {
	        return new account(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.holder = source["holder"];
	        this.cash = source["cash"];
	        this.investments = this.convertValues(source["investments"], investment);
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

