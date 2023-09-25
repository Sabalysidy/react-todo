const { useState, useEffect } = React;

function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [lastId, setLastId] = useState(0);

    // Fonction pour sauvegarder les todos dans localStorage
    const saveTodosToLocalStorage = () => {
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    // Fonction pour récupérer les todos depuis localStorage lors du chargement de la page
    const getTodosFromLocalStorage = () => {
        const storedTodos = localStorage.getItem("todos");
        if (storedTodos) {
            setTodos(JSON.parse(storedTodos));
        }
    };

    // Fonction pour valider une tâche
    const validTodo = (index) => {
        const updatedTodos = [...todos];
        updatedTodos[index].validated = true; // Ajout d'une propriété "validated" à la tâche
        setTodos(updatedTodos);
    };

    // Fonction pour archiver une tâche
    const archiveTodo = (index) => {
        const updatedTodos = [...todos];
        updatedTodos[index].archived = true; // Ajout d'une propriété "archived" à la tâche
        setTodos(updatedTodos);
    };

    // Utiliser useEffect pour charger les todos depuis localStorage au chargement de la page
    useEffect(() => {
        getTodosFromLocalStorage();
    }, []);

    // Utiliser useEffect pour sauvegarder les todos dans localStorage lorsque la liste change
    useEffect(() => {
        saveTodosToLocalStorage();
    }, [todos]);

    // Fonction pour ajouter ou mettre à jour une tâche
    const addTodo = () => {
        if (name.trim() !== "" && email.trim() !== "") {
            if (editMode) {
                // Mise à jour d'une tâche existante
                const updatedTodos = [...todos];
                updatedTodos[editIndex] = { id: todos[editIndex].id, name, email, validated: false, archived: false }; // Ajoutez la propriété validated et archived
                setTodos(updatedTodos);
                setEditMode(false);
                setEditIndex(null);
            } else {
                // Ajout d'une nouvelle tâche avec un nouvel ID
                const newTodo = { id: lastId + 1, name, email, validated: false, archived: false }; // Ajoutez la propriété validated et archived
                setTodos([...todos, newTodo]);
                setLastId(lastId + 1);
            }
            // Effacez les champs de saisie
            setName("");
            setEmail("");
        }
    };

    // Fonction pour supprimer une tâche
    const removeTodo = (id) => {
        const newTodos = todos.filter((todo) => todo.id !== id);
        setTodos(newTodos);
    };

    // Fonction pour archiver ou désarchiver une tâche
    const toggleArchiveTodo = (index) => {
        const updatedTodos = [...todos];
        updatedTodos[index].archived = !updatedTodos[index].archived; // Inversez la propriété archived
        setTodos(updatedTodos);
    };

    // Fonction pour activer le mode édition d'une tâche
    const editTodo = (index) => {
        const todoToEdit = todos[index];
        setName(todoToEdit.name);
        setEmail(todoToEdit.email);
        setEditMode(true);
        setEditIndex(index);
    };

    // Fonction pour annuler le mode édition
    const cancelEdit = () => {
        setEditMode(false);
        setEditIndex(null);
        setName("");
        setEmail("");
    };

    // Séparez les tâches archivées des tâches non archivées
    const archivedTodos = todos.filter((todo) => todo.archived);
    const activeTodos = todos.filter((todo) => !todo.archived);

    return (
        <div>
            <h1>Todo_List_React</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {editMode ? (
                    <div>
                        <button className="update-btn" onClick={addTodo}>Mettre à jour</button>
                        <button className="cancel-btn" onClick={cancelEdit}>Annuler</button>
                    </div>
                ) : (
                    <button className="add-btn" onClick={addTodo}>Ajouter</button>
                )}
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>E-mail</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeTodos.map((todo, index) => (
                            <tr key={index} style={{ background: todo.validated ? '#8bc34a' : 'transparent' }}>
                                <td>{todo.id}</td>
                                <td>{todo.name}</td>
                                <td>{todo.email}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="edit-btn" onClick={() => editTodo(index)}>Éditer</button>
                                        <button className="delete-btn" onClick={() => removeTodo(todo.id)}>Supprimer</button>
                                        <button className="archive-btn" onClick={() => toggleArchiveTodo(index)}>
                                            {todo.archived ? "Désarchiver" : "Archiver"}
                                        </button>
                                        {!todo.validated && (
                                            <button className="validate-btn" onClick={() => validTodo(index)}>Valider</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {archivedTodos.length > 0 && (
                <div>
                    <hr />
                    <h2>Tâches archivées</h2>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nom</th>
                                    <th>E-mail</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {archivedTodos.map((todo, index) => (
                                    <tr key={index} style={{ background: '#f0f0f0' }}>
                                        <td>{todo.id}</td>
                                        <td>{todo.name}</td>
                                        <td>{todo.email}</td>
                                        <td>
                                            <button className="archive-btn" onClick={() => toggleArchiveTodo(index)}>
                                                Désarchiver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<TodoApp />, document.getElementById("root"));
