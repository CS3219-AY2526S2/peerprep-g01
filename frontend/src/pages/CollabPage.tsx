import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import PageHeader from "../features/user/PageHeader";
import useCollabSession from "../hooks/useCollabSession";
import CollabPanel from "../features/user/CollabPanel";
import CodeIcon from "@mui/icons-material/Code";
import ChatIcon from "@mui/icons-material/Chat";
import ArticleIcon from "@mui/icons-material/Article";
import { pink, cyan, blue, green, orange } from "@mui/material/colors";
import { Editor } from "@monaco-editor/react";
import ChipAttribute from "../components/ChipAttribute";
import ConfirmDialog from "../components/ConfirmDialog";
import AudioControls from "../components/AudioControls";
import useAuthStore from "../store/authStore";

function CollabPage() {
  const {
    question,
    language,
    setLanguage,
    handleEditorMount,
    handleLeave,
    leaveDialogOpen,
    setLeaveDialogOpen,
    socket,
    roomId,
    isUserOne,
  } = useCollabSession();

  const myUserId = useAuthStore((s) => s.user?.userId ?? "");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <PageHeader />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "44% calc(56% - 12px)" },
          gridTemplateRows: { xs: "auto auto 1fr", sm: "3fr 1fr" },
          gap: 1.5,
          p: 1.5,
          flexGrow: 1,
          overflow: { xs: "auto", sm: "hidden" },
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            gridRow: { sm: "1 / 2" },
            gridColumn: { sm: "1 / 2" },
            minHeight: { xs: 200 },
          }}
        >
          <CollabPanel
            title="Question"
            Icon={<ArticleIcon sx={{ color: blue["A400"] }} />}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {question?.questionName ?? "Loading Title..."}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <ChipAttribute
                  label={question?.topicName ?? "Loading Topic"}
                  color={pink}
                />
                <ChipAttribute
                  label={question?.difficulty ?? "Loading Difficulty"}
                  color={cyan}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {question?.description ?? "Loading Description..."}
              </Typography>
            </Box>
          </CollabPanel>
        </Box>

        <Box
          sx={{
            gridRow: { sm: "1 / 3" },
            gridColumn: { sm: "2 / 3" },
            minHeight: { xs: 400 },
          }}
        >
          <CollabPanel
            title="Code Editor"
            Icon={<CodeIcon sx={{ color: green[500] }} />}
            allowOverflow
            headerActions={
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                size="small"
                sx={{ fontSize: 12, height: 28, bgcolor: "white" }}
              >
                {["javascript", "typescript", "python", "java", "cpp"].map(
                  (lang) => (
                    <MenuItem key={lang} value={lang} sx={{ fontSize: 12 }}>
                      {lang}
                    </MenuItem>
                  ),
                )}
              </Select>
            }
          >
            {/* Monaco editor goes here */}
            <Editor
              height="100%"
              language={language}
              onMount={handleEditorMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: "on",
              }}
            />
          </CollabPanel>
        </Box>

        <Box
          sx={{
            gridRow: { sm: "2 / 3" },
            gridColumn: { sm: "1 / 2" },
            minHeight: { xs: 200 },
          }}
        >
          <CollabPanel
            title="Communication"
            Icon={<ChatIcon sx={{ color: orange[400] }} />}
          >
            <Box sx={{ p: 1.5 }}>
              <AudioControls
                socket={socket}
                myUserId={myUserId}
                isUserOne={isUserOne}
                roomId={roomId ?? ""}
              />
            </Box>
          </CollabPanel>
        </Box>
      </Box>

      <Container
        maxWidth="sm"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Button
          variant="contained"
          onClick={() => setLeaveDialogOpen(true)}
          color="warning"
          sx={{ marginBottom: 2 }}
        >
          Leave Session
        </Button>
      </Container>

      <ConfirmDialog
        open={leaveDialogOpen}
        title="Leave Session"
        description="Are you sure you want to leave? Your partner will be notified."
        confirmLabel="Leave"
        confirmColor="warning"
        onConfirm={handleLeave}
        onCancel={() => setLeaveDialogOpen(false)}
      />
    </Box>
  );
}

export default CollabPage;
