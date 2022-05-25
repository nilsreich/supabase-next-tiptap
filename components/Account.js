import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { ChevronDownIcon, PlusIcon } from "@radix-ui/react-icons";

export default function Account({ session }) {
  const [mail, setMail] = useState("");
  const [klassen, setKlassen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [isActive, setActive] = useState(0);
  const [content, setContent] = useState([]);
  const [sessionTitle, setSessionTitle] = useState(null);
  const [editorcontent, setEditorContent] = useState("a");

  const toggleKlasse = (classes_id) => {
    setActive(classes_id);
    getSession(classes_id);
  };

  const openSession = (session_id) => {
    setActive(session_id);
    let temp = content.find(({ id }) => id === session_id);
    setEditorContent(temp.content);
  };

  async function getSession(classes_id) {
    try {
      setLoading(true);

      const user = supabase.auth.user();
      let { data, error, status } = await supabase
        .from("sessions")
        .select(`id, title, content`)
        .eq("author", user.id)
        .eq("class", classes_id);
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setContent(data);
        console.log(data[0].id);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      setMail(user.email);
      let { data, error, status } = await supabase
        .from("classes")
        .select(`id,name`)
        .eq("author", user.id);
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setKlassen(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black text-xs text-neutral-300">
      <div className="flex flex-1">
        <div className="w-24 border-r border-neutral-800">
          <div className="py-1 px-2 text-neutral-500 uppercase flex justify-between items-center">
            <div>Klassen</div>
            <PlusIcon />
          </div>
          {klassen != null
            ? klassen.map((klasse) => (
                <div
                  onClick={() => toggleKlasse(klasse.id)}
                  className={
                    isActive === klasse.id
                      ? "border-l-2 border-white text-white p-4 text-sm"
                      : "border-l-2 border-black text-neutral-500 p-4 text-sm hover:text-white"
                  }
                  key={klasse.id}
                >
                  {klasse.name}
                </div>
              ))
            : null}
        </div>
        <div className="w-60 border-r border-neutral-800 ">
          <div className="border-b border-neutral-800 py-1 px-2 text-neutral-500 uppercase flex items-center justify-between">
            <div className="flex items-center">
              <ChevronDownIcon />
              <div className="ml-2">Session</div>
            </div>
            <div>
              <PlusIcon />
            </div>
          </div>
          {content != null
            ? content.map((item) => (
                <div
                  onClick={() => openSession(item.id)}
                  className={
                    isActive === item.id
                      ? "py-2 pl-8 truncate text-neutral-500 bg-neutral-900 text-sm "
                      : "py-2 pl-8 truncate text-neutral-500 hover:bg-neutral-900 text-sm"
                  }
                  key={item.id}
                >
                  {item.title}
                </div>
              ))
            : null}
        </div>{" "}
        <div className="flex-1 p-6">{editorcontent}3</div>
      </div>
      <div className="flex justify-between border-t border-neutral-800">
        <div className="bg-blue-600 px-2 py-1 text-neutral-50">{mail}</div>
        <button className="px-2 py-1" onClick={() => supabase.auth.signOut()}>
          logout
        </button>
      </div>
    </div>
  );
}
