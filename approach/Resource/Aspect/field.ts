import type { Node } from "../../Render/Node/Node";
import { Aspect } from "./Aspect";

class field extends Aspect {
    public static label: string | null = null;		// label for the field
    public static type: number | null = null;		// type of the field
    public static default: string | Node | null = null; 	// default value for the field
    public static source_type: string | Node | null = null; 	// default value for the field
    public static source_default: string | Node | null = null; 	// default value for the field
    public static nullable = null; 	// whether the field can be null
    public static readonly = null; 	// whether the field is read-only
    public static required = null; 	// whether the field is required
    public static description = null; 	// description of the field
    public static is_accessor = false; 	// whether the field is an accessor
    public static is_primary = false; 	// whether the field is a primary accessor
}
