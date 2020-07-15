export default function(value: boolean, reason: string = "") : void
{
	if (!value) throw Error(reason);
}
