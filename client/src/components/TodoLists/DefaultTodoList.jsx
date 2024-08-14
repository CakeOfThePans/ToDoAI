//uses listid if it's inbox
export default function DefaultTodoList({ list, handleClick, currentList }) {
	return (
		<li onClick={handleClick} className={"cursor-pointer rounded-xl p-2 mx-2 transition-all flex justify-between items-center"  + (currentList == list.id || currentList == list.name ? " bg-gray-100" : "")} id={list.id? list.id : list.name}>
			<div className="flex justify-between items-center w-full" id={list.id? list.id : list.name}>
				<span className="truncate" id={list.id? list.id : list.name}>
					{list.name}
				</span>
				<div className="text-gray-400">{list.count}</div>
			</div>
		</li>
	)
}
